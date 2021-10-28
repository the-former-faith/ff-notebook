<script>
  import { createMachine, assign, interpret } from 'xstate'
	let files
  let blob

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
      idle: {
      },
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

  const service = interpret(fileMachine).onTransition((state) => {console.log(state)}).start()

</script>

<p>{$service.can('NEW_UPLOAD')}</p>

<img src={blob} alt="New upload" />

<label for="image">Choose a profile picture:</label>

<input
  type="file"
  id="image"
  name="image"
  accept="image/*"
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