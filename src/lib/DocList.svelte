<script>
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import { readableMap } from 'svelt-yjs'
  import { onMount } from 'svelte';

  const ydoc = new Y.Doc({ autoLoad: true })
  const documentList = ydoc.getMap('doc-list')
  let readableDocumentList = readableMap(documentList)
  let list = {}
  let idbPersistence
  let currentDoc

  $: if(currentDoc) {
    console.log(currentDoc.fields)
  }

  onMount(()=> {
    idbPersistence = new IndexeddbPersistence('database', ydoc)
  })

  const createDoc = () => {
    const newDoc = new Y.Doc({ autoLoad: true })
    const fields = newDoc.getMap('fields')
    fields.set('title', '')
    fields.set('createdAt', Date.now() )
    fields.set('updatedAt', Date.now() )
    documentList.set(newDoc.guid, newDoc)
  }

  ydoc.on('subdocs', (e) => {
    console.log(e)

    e.added.forEach(subdoc => {
      subdoc.load()
    })

    e.loaded.forEach(subdoc => {
      const persistence = new IndexeddbPersistence(subdoc.guid, subdoc)
      persistence.on('synced', (e) => {
        const ymap = subdoc.getMap('fields')
        const fields = readableMap(ymap)
        list[subdoc.guid] = {
          fields: fields,
          persistence: persistence,
          doc: subdoc
        }
      })
    })

  })
</script>

<ul id="note-list" class="nostyle">
  {#each [...$readableDocumentList] as [id, doc]}
      <li>
        <button on:click={()=> console.log(doc.getMap('fields').get('title'))}>Doc: {doc.getMap('fields').get('title')}</button>
      </li>
    {/each}
    <!--{#each Object.entries(list) as [id, doc]}
      <li>
        <button on:click={()=> currentDoc = doc}>Doc: {doc.doc.getMap('fields').title}</button>
        <button on:click={()=> {
          const doc = documentList.get( id )
          console.log(doc)
          //list[id] = documentList.get( id ).getMap('fields').toJSON()
        }}>Refresh</button>
      </li>
    {/each}-->
</ul>
<button on:click={()=> createDoc()}>Create Doc</button>
{#if currentDoc}
    <label for="title">Title
      <input 
        name="title"
        id="title"
        type="text" 
        value={currentDoc.doc.getMap('fields').get('title') ? currentDoc.doc.getMap('fields').get('title') : ''} 
        on:keyup={(e) => currentDoc.doc.getMap('fields').set('title', e.target.value)}
      />
    </label>
  {/if}


<!--<script>
  import { mainService } from '$lib/scripts/mainMachine'
  import CreateDocButton from './CreateDocButton.svelte'
  import DetailsSummary from '$lib/components/molecules/DetailsSummary.svelte'
  import DocLink from '$lib/DocLink.svelte'
  import { currentID, allDocsOpened } from '$lib/scripts/stores'
</script>

  <CreateDocButton />
  <DetailsSummary title="All Docs" isOpen={$allDocsOpened}>
    <ul id="note-list" class="nostyle">
      {#if $mainService?.context.docList.size > 0}

        {#each [...$mainService.context.docList] as [id, doc]}
          <li>
            <DocLink 
              {id} 
              {doc} 
              --text-color={$currentID == id ? 'var(--action-color)' : 'currentColor'} 
              current={$currentID == id}
            />
          </li>
        {/each}
  
      {/if}
    </ul>
  </DetailsSummary>

<style>
  
  ul {
    padding: 0;
    list-style: none;
    display: grid;
  }

  li {
    border-top: 1px solid var(--accent-color);
  }
</style>-->