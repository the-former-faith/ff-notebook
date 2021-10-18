<script>
  import { onMount } from 'svelte'
  import { db, currentDoc, allDocsOpened, collections } from '$lib/scripts/stores'
  import DetailsSummary from '$lib/components/molecules/DetailsSummary.svelte'

  import CreateDocButton from './CreateDocButton.svelte'
  import DocLink from '$lib/DocLink.svelte'
  import { v1 as uuidv1 } from 'uuid'
  import { goto } from '$app/navigation'
  import { mainService } from '$lib/scripts/mainMachine'

  const createDoc = async () => {
    const blankDoc = {
      id: uuidv1(),
      name: '',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    }
    const db$ = await db()
    const newDoc = await db$.notes.insert(blankDoc)
    $currentDoc = newDoc
    goto(`/${newDoc.id}`)
    $allDocsOpened = false
  }

  let db$
  let noteList = []

  $: if($mainService?.context.collections) {
    if (noteList.length == 0) {
      const getNoteList = async () => {
        let posts = $mainService?.context.collections
        posts
          .find()
          .sort({ updatedAt: 'desc' })
          .$.subscribe((notes) => (noteList = notes))
      }
      getNoteList()
    }
  }

  //Move this to a svelte store
  onMount(() => {

  })
</script>

<!--<button on:click={()=> createDoc()}>Create New Doc</button>-->
<CreateDocButton />
<DetailsSummary title="All Docs" isOpen={$allDocsOpened}>
  <ul id="note-list" class="nostyle">
    {#await noteList}
      Loading Notes...
    {:then results}
      {#each results as doc}
        <li>
          <DocLink 
            {doc} 
            --text-color={$currentDoc?.id == doc.id ? 'var(--action-color)' : 'currentColor'} 
            current={$currentDoc?.id == doc.id}
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

  button {
    background-color: var(--action-color);
    color: var(--background-color);
    font-weight: 700;
    position: absolute;
    top: 0;
    right: 0;
    width: auto;
  }
</style>