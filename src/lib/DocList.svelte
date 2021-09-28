<script>
  import { onMount, onDestroy } from 'svelte'
  import { createRxDatabase, addRxPlugin } from 'rxdb/plugins/core'
  import { addPouchPlugin, getRxStoragePouch } from 'rxdb/plugins/pouchdb'
  import * as idb from 'pouchdb-adapter-idb'

  let db

  onMount(async() => {
    addPouchPlugin(idb)

    db = await createRxDatabase({
      name: 'rxdbdemo',
      storage: getRxStoragePouch('idb'),
      ignoreDuplicate: true
    })
    console.log(db)
  })

  const createDoc = () => {
  }

</script>

<aside>
  <h2>All Docs</h2>
  <!--<button on:click={() => createDoc()}>+ Create New Document</button>
  <button on:click={() => documentList.delete(0, documentList.length)}>- Delete All</button>
  <ul>
    {#each $readableDocumentList as doc, i}
      <li>
        <a href="/{doc.guid}">Document {i}</a>
      </li>
    {/each}
  </ul>-->
</aside>