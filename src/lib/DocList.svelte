<script>
  import { onMount } from 'svelte'
  import { db, currentDoc, allDocsOpened, currentID } from '$lib/scripts/stores'
  import DetailsSummary from '$lib/components/molecules/DetailsSummary.svelte'

  import CreateDocButton from './CreateDocButton.svelte'
  import DocLink from '$lib/DocLink.svelte'
  import { v1 as uuidv1 } from 'uuid'
  import { goto } from '$app/navigation'

  const createDoc = async () => {
    const blankDoc = {
      id: uuidv1(),
      name: '',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    }
    const db$ = await db()
    const newDoc = await db$.notes.insert(blankDoc)
    //goto(`/${newDoc.id}`)
    $allDocsOpened = false
  }

  let db$
  let noteList = []

  onMount(() => {
    const getNoteList = async () => {
      db$ = await db()
      db$.notes
        .find()
        .sort({ updatedAt: 'desc' })
        .$.subscribe((notes) => (noteList = notes))
    }
    getNoteList()
  })
</script>

<button on:click={()=> createDoc()}>Create New Doc</button>
<DetailsSummary title="All Docs" isOpen={$allDocsOpened}>
  <ul id="note-list" class="nostyle">
    {#await noteList}
      Loading Notes...
    {:then results}
      {#each results as doc}
        <li>
          <DocLink 
            {doc} 
            --text-color={$currentID == doc.id ? 'var(--action-color)' : 'currentColor'} 
            current={$currentID == doc.id}
          />
        </li>
      {/each}
    {/await}
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
</style>


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
-->