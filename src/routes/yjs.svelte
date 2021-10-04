<script>
	import { browser } from '$app/env'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import * as Y from 'yjs'

  let documentList
  let ydoc

  if(browser) {
    // A Yjs document holds the shared data
    ydoc = new Y.Doc()
    // This Y.Array contains a list of documents represented as Y.Text

    const persistence = new IndexeddbPersistence('database', ydoc)
    persistence.once('synced', () => { console.log('initial content loaded') })
    documentList = ydoc.getMap('doc-list')

    documentList.observe( ( event => console.log(event) ) )
  }

  const createDoc = () => {
    
    const newDoc = new Y.Text()
    
    documentList.set('prop-name', newDoc)
  } 


</script>

<button on:click={ ()=> createDoc() }>New Doc!</button>