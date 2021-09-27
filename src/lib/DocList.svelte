<script>
  import { onMount, onDestroy } from 'svelte'
  import * as Y from 'yjs'
  //import { WebsocketProvider } from 'y-websocket'
  import { readableArray } from 'svelt-yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import { currentDoc } from '$lib/stores.js'

  let ywebsocket
  let provider
  let awareness

  let ydoc = new Y.Doc()
  const documentList = ydoc.getArray('doc-list')
  const readableDocumentList = readableArray(documentList)
  const persistence = new IndexeddbPersistence('doc-list', ydoc)

  persistence.on('synced', () => {
    console.log('content from the database is loaded')
  })

  $: if($readableDocumentList[0]){
    //console.log($readableDocumentList[0].getMap('fields').get('title'))
  }

  const createDoc = () => {
    const newDoc = new Y.Doc()
    documentList.push([newDoc])
    currentDoc.set(newDoc)
  }

  onMount(async() => {
    ywebsocket = await import ('y-websocket')
    provider = new ywebsocket.WebsocketProvider('wss://ff-server.onrender.com', 'all-docs ', ydoc)
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
  <button on:click={() => createDoc()}>+ Create New Document</button>
  <button on:click={() => documentList.delete(0, documentList.length)}>- Delete All</button>
  <ul>
    {#each $readableDocumentList as doc, i}
      <li>
        <button index={i} on:click={() => currentDoc.set(documentList.get(i))}>Document {i}</button>
      </li>
    {/each}
  </ul>
</aside>