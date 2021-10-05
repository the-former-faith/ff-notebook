<script>
	import { browser } from '$app/env'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import * as Y from 'yjs'
  import { v1 as uuidv1 } from 'uuid'

  let documentList
  let myList
  let ydoc

  if(browser) {

    ydoc = new Y.Doc()

    documentList = ydoc.getMap('doc-list')

    const persistence = new IndexeddbPersistence('database', ydoc)
    //persistence.on('synced', (e) => { console.log(e) })
    
    ydoc.on('subdocs', (e) => {
      console.log(e)
      e.added.forEach(subdoc => {
         subdoc.load()
      })

      e.loaded.forEach(subdoc => {
        const persistence = new IndexeddbPersistence(subdoc.guid, subdoc)
        persistence.on('synced', e => console.log(e))
      })
    })

    documentList.observe( ( event => myList = Object.entries(documentList.toJSON() ) ) ) 
  }

  const createDoc = () => {

    const id = uuidv1()
    const newDoc = new Y.Doc()
    const fields = newDoc.getMap('fields')
    fields.set('title', `Doc ${Math.floor(Math.random() * 100)}`)
    const persistence = new IndexeddbPersistence(id, newDoc)
    
    documentList.set(id, newDoc)
  } 


</script>

<div>
<button on:click={ ()=> createDoc() }>New Doc!</button>

{#if myList}
  <h1>Test</h1>
  <ul>
    {#each myList as [key, value]}
      <li>
        <button on:click={ ()=> console.log(documentList.get(key).getMap('fields').toJSON().title ) }>{key}</button>
      </li>
    {/each}
  </ul>
{/if}
</div>