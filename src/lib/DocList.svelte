<script>
  import { onMount, onDestroy } from 'svelte'
  import * as Y from 'yjs'
  //import { WebsocketProvider } from 'y-websocket'
  import { readableMap, readableArray } from 'svelt-yjs'
  import { currentDoc } from '$lib/stores.js';

  let ywebsocket
  let provider
  let awareness

  let ydoc = new Y.Doc()
  const documentList = ydoc.getArray('doc-list')
  const readableDocumentList = readableArray(documentList)

  const createDoc = () => {
    const newDoc = new Y.Text()
    documentList.push([newDoc])
    //@TODO - fix editor binding
    //bindEditor(newDoc)
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
        <button index={i} on:click={() => currentDoc.set(documentList.get(i).doc)}>Document {i}</button>
      </li>
    {/each}
  </ul>
</aside>