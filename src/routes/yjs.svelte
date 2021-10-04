<script>
	import { browser } from '$app/env'
  import * as Y from 'yjs'

  // A Yjs document holds the shared data
  const ydoc = new Y.Doc()
  // This Y.Array contains a list of documents represented as Y.Text
  const documentList = ydoc.getMap('doc-list')

  documentList.observe( ( event => console.log(event) ) )

  const createDoc = () => {
    
    const newDoc = new Y.Text()
    console.log(newDoc)
    
    //documentList.push([newDoc])
  } 


</script>

<button on:click={ ()=> createDoc() }>New Doc!</button>