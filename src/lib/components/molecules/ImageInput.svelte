<script>
  import { createMachine, assign, interpret } from 'xstate'
	let files
  let blob
  export let src
  export let id = 'g'

  $: if(files) blob = URL.createObjectURL(files[0])

  //$: console.log(blob)

  const fileMachine = createMachine({
    id: 'fileMachine',
    initial: 'loading',
    context: {
      id: id,
      db: undefined,
      error: undefined,
      file: undefined,
      binaryFile: undefined
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

            var request = files.get(ctx.id)

            request.onerror = function(event) {
              console.log('no file')
            }

            request.onsuccess = function(event) {
              console.log(request.result);
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
      idle: {
        on: {
          NEW_UPLOAD: {
            target: 'converting_to_binary',
            actions: [
              assign({
                file: (ctx, evt) => evt.file
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

            reader.readAsBinaryString(ctx.file)

            reader.onload = function(e) {
              send({ type: 'SUCCESS', binaryFile: e.target.result })
            }

          },
        },
        on: {
          SUCCESS: {
            target: 'storing',
            actions: [
              assign({
                binaryFile: (ctx, evt) => evt.binaryFile
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
              file: ctx.binaryFile
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