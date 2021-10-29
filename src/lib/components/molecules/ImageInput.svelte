<script>
  import { createMachine, assign, interpret } from 'xstate'
	let files
  let blob
  export let src
  export let id = '8c8fe3c0-3670-11ec-b3ce-bf7d358eddae'

  $: if(files) blob = URL.createObjectURL(files[0])

  //$: console.log(blob)

  const fileMachine = createMachine({
    id: 'fileMachine',
    initial: 'loading',
    context: {
      id: id,
      db: undefined,
      error: undefined,
      blob: undefined
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
            target: 'idle',
            actions: [
              assign({
                db: (ctx, evt) => evt.db,
              })
            ]
          }
        }
      },
      //@TODO: add check to see if image is in indexedDB??
      idle: {
        on: {
          NEW_UPLOAD: {
            target: 'storing',
            actions: [
              assign({
                blob: (ctx, evt) => URL.createObjectURL(evt.file)
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
              id: ctx.id,
              blob: ctx.blob
            }

            let request = files.add(file)

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

  const service = interpret(fileMachine).onTransition((state) => {console.log(state)}).start()

</script>

<img src={src ? scr : blob} />

<label for="image">Choose a profile picture:</label>

<input
  type="file"
  id="image"
  name="image"
  accept="image/*"
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