<script>
  import { createMachine, assign, interpret } from 'xstate'
  import { beforeUpdate, onDestroy } from 'svelte'
  import { currentDoc } from '$lib/scripts/stores'

	let files
  let base64URI
  let previousId
  let service
  let input
  export let src
  export let id

  const fileMachine = createMachine({
    id: 'fileMachine',
    initial: 'loading',
    context: {
      id: id, //Not using at the moment because it wasn't updating
      db: undefined,
      error: undefined,
      file: undefined,
      base64URI: undefined
    },
    states: { 
      loading: {
        invoke: {
          id: 'loadIndexedDB',
          src: (context, event) => (send)=> {
            const request = indexedDB.open('fileUploads', 2)

            request.onupgradeneeded = function(event) {
              const db = event.target.result

              db.createObjectStore('files', {keyPath: 'id'})
            }

            request.onsuccess = function(event) {
              send({
                type: 'SUCCESS',
                db: event.target.result,
              })
            }

          },
        },
        on: {
          SUCCESS: {
            target: 'checking_for_existing_file',
            actions: [
              assign({
                db: (ctx, evt) => evt.db,
              })
            ]
          }
        }
      },
      checking_for_existing_file: {
        invoke: {
          id: 'checkForExisting',
          src: (ctx, evt) => (send)=> {
            let transaction = ctx.db.transaction("files")

            let files = transaction.objectStore("files")

            var request = files.get($currentDoc.id)

            request.onerror = function(event) {
            }

            request.onsuccess = function(event) {
              if (request.result) {
                send({ type: 'FILE_FOUND', base64URI: request.result.file })
              } else {
                send({ type: 'FILE_NOT_FOUND' })
              }
            }
          },
        },
        on: {
          FILE_FOUND: {
            target: 'idle',
            actions: [
              assign({
                base64URI: (ctx, evt) => evt.base64URI
              })
            ]
          },
          FILE_NOT_FOUND: {
            target: 'idle',
          }
        }
      },
      idle: {
        on: {
          NEW_UPLOAD: {
            target: 'converting_to_binary',
            actions: [
              assign({
                file: (ctx, evt) => evt.file
              })
            ]
          },
          DELETE_FILE: {
            target: 'deleting_file',
          },
        }
      },
      deleting_file: {
        invoke: {
          id: 'deleteFile',
          src: (ctx, evt) => (send)=> {
            const request = ctx.db.transaction("files", "readwrite")
              .objectStore("files")
              .delete($currentDoc.id)

            request.onsuccess = function(event) {
              send({ type: 'SUCCESS' })
            }
          },
        },
        on: {
          SUCCESS: {
            target: 'idle',
            actions: [
              assign({
                base64URI: (ctx, evt) => undefined
              })
            ]
          }
        }
      },
      converting_to_binary: {
        invoke: {
          id: 'convertToBinary',
          src: (ctx, evt) => (send)=> {

            const reader = new FileReader()

            reader.readAsDataURL(ctx.file)

            reader.onload = function(e) {
              send({ type: 'SUCCESS', base64URI: e.target.result })
            }

          },
        },
        on: {
          SUCCESS: {
            target: 'storing',
            actions: [
              assign({
                base64URI: (ctx, evt) => evt.base64URI
              })
            ]
          }
        }
      },
      storing: {
        invoke: {
          id: 'loadIndexedDB',
          src: (ctx, evt) => (send)=> {
            let transaction = ctx.db.transaction("files", "readwrite")

            // get an object store to operate on it
            let files = transaction.objectStore("files")

            let file = {
              id: $currentDoc.id,
              file: ctx.base64URI
            }

            let request = files.put(file)

            //Send updates to parent
            request.onsuccess = function() {
              send({ type: 'SUCCESS' })
            }

            //Send update to parent
            request.onerror = function() {
              console.log("Error", request.error)
            }
          },
        },
        on: {
          SUCCESS: {
            target: 'idle',
          }
        }
      }
    }
  })

  const handleChange = () => {
    //Store blob.
    //Clear URL from RxDB, if exists.
    //If old blob is waiting to be uploaded, delete from indexedDB
  }


  $: if($service?.context) {
    base64URI = $service.context.base64URI
  }

  beforeUpdate(() => {
    if (previousId !== id) {
      service = interpret(fileMachine).onTransition((state) => {console.log(state)}).start()
      previousId = id
    }
  })

  onDestroy(() => {
    if (service) {
      service.stop()
    }
  })

</script>

{#if base64URI}
  <img src={base64URI} />
  <button on:click={(e)=> {
    service.send({type: 'DELETE_FILE'})
    files = undefined
    input.value = ''
  }}>Delete Image</button>
{/if}

<label for="image">Choose a profile picture:</label>

<input
  type="file"
  id="image"
  name="image"
  accept="image/*"
  bind:this={input}
  bind:files
  on:change={ (e)=> service.send({type: 'NEW_UPLOAD', file: e.target.files[0]}) }
/>

<style>
  img {
    width: 100%;
  }

  input[type=file] {
    font-size: inherit;
  }

  input[type=file]::file-selector-button {
    border: 0;
    padding: .5rem 1rem;
    background-color: var(--action-color);
    transition: 1s;
  }
</style>