<script>
  import { onMount } from 'svelte'
  import { db, currentDoc } from '$lib/scripts/stores'
  import CreateDocButton from './CreateDocButton.svelte'
  import DocLink from '$lib/DocLink.svelte'
  import { v1 as uuidv1 } from 'uuid'

  const createDoc = async () => {
    const blankDoc = {
      id: uuidv1(),
      name: 'new note',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    }
    const db$ = await db()
    const newDoc = await db$.notes.insert(blankDoc)
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

  const handleEditNote = (note) => {
    //console.log(note)
    $currentDoc = note
    //name.set(note.name)
    //body.set(note.body)
  }

  const deleteNote = async (doc) => {
    // if ($currentDoc.get('id') === doc.id) {
    //   currentDoc.set(undefined)
    // }

    await doc.remove()
  }
</script>

  <h2>All Docs</h2>
  <button on:click={()=> createDoc()}>Create New Doc</button>
  <ul id="note-list" class="nostyle">
    {#await noteList}
      Loading Notes...
    {:then results}
      {#each results as doc}
        <li>
          <a href={doc.id} on:click={() => handleEditNote(doc)}>{doc.name ? doc.name : 'untitled note'}</a>
          <span class="meta">
            {new Date(doc.updatedAt).toLocaleDateString('en-US')}
            <button on:click={() => deleteNote(doc)} class="btn btn-delete">delete</button>
          </span>
        </li>
      {/each}
    {/await}
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