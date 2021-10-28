<script>
  import { createMachine, assign, interpret } from 'xstate'
	let files
  let blob
  export let src

  $: if(files) blob = URL.createObjectURL(files[0])

  //$: console.log(blob)

  const fileMachine = createMachine({
    id: 'fileMachine',
    initial: 'loading',
    context: {
      db: undefined,
      error: undefined
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

              console.log("I'm gonna take the upgrade")
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
            target: 'success',
            actions: [
              assign({
                db: (ctx, evt) => evt.db,
              })
            ]
          }
        }
      },
      success: {
        on: {
          'NEW_UPLOAD': {
            actions: [
              ()=> console.log('uploading')
            ]
          }
        }
      },
    }
  })

  const handleChange = () => {
    //Store blob.
    //Clear URL from RxDB, if exists.
    //If old blob is waiting to be uploaded, delete from indexedDB
  }

  const storeBlob = () => {
    //TODO: move this to an xstate invoked callback,
    //so it can access db in context
    //and return error or success to the machine
    let transaction = db.transaction("files", "readwrite")

    // get an object store to operate on it
    let files = transaction.objectStore("files")

    let file = {
      id: '', //Pass ID into component as prop
      blob: '' //Add blob
    }

    let request = files.add(file)

    //Send updates to parent
    request.onsuccess = function() {
      console.log("Book added to the store", request.result)
    }

    //Send update to parent
    request.onerror = function() {
      console.log("Error", request.error)
    }

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
  disabled={!$service.can('NEW_UPLOAD')}
  bind:files
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