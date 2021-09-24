<script>
  import { onMount, onDestroy } from 'svelte'
  import * as Y from 'yjs'
  //import { WebsocketProvider } from 'y-websocket'
  import { readableMap } from 'svelt-yjs'

  let ywebsocket
  let provider
  let ydoc = new Y.Doc()
  //const ymap = ydoc.getMap('fields')
  //const fields = readableMap(ymap)
  let awareness

  onMount(async() => {
    ywebsocket = await import ('y-websocket')
    provider = new ywebsocket.WebsocketProvider('wss://ff-server.onrender.com', 'example-document', ydoc)

    awareness = provider.awareness
  })

  onDestroy(() => {
    if (provider) {
      provider.destroy()
    }
  })
</script>

<aside>
  <h2>All Docs</h2>
</aside>