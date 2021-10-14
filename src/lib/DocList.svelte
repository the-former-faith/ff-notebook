<script>
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import { readableMap } from 'svelt-yjs'

  const ydoc = new Y.Doc()
  const documentList = ydoc.getMap('doc-list')
  let documentList$ = readableMap(documentList)
  let list = {}

  $: console.log($documentList$)

  const idbPersistence = new IndexeddbPersistence('database', ydoc)

  const createDoc = (context, event) => {
    const newDoc = new Y.Doc()
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
        list[subdoc.guid] = documentList.get( subdoc.guid ).getMap('fields').toJSON()
      })
    })

  })
</script>

<ul id="note-list" class="nostyle">
    {#each Object.entries(list) as [id, doc]}
      <li>
        <a href={id}>{doc.title}</a>
        <button on:click={()=> {
          list[id] = documentList.get( id ).getMap('fields').toJSON()
        }}>Refresh</button>
      </li>
    {/each}
</ul>


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