<script>
  import { onMount } from 'svelte'
  import { db, currentDoc, name, body } from '$lib/stores'
  //import CreateDocButton from './CreateDocButton.svelte'
  import DocLink from '$lib/DocLink.svelte'

  let db$
  let noteList = []

  //@TODO: Move this to rxdbMachine
  onMount(() => {
    // const getNoteList = async () => {
    //   db$ = await db()
    //   db$.notes
    //     .find()
    //     .sort({ updatedAt: 'desc' })
    //     .$.subscribe((notes) => (noteList = notes))
    // }
    // getNoteList()
  })

  const handleEditNote = (note) => {
    currentDoc.set(note)
    name.set(note.name)
    body.set(note.body)
  }

  const deleteNote = async (doc) => {
    // if ($currentDoc.get('id') === doc.id) {
    //   currentDoc.set(undefined)
    // }

    await doc.remove()
  }
</script>

<aside>
  <h2>All Docs</h2>
  <!--<CreateDocButton />-->
  <ul id="note-list" class="nostyle">
    {#await noteList}
      Loading Notes...
    {:then results}
      {#each results as doc}
        <li>
          <DocLink {doc} />

          <span class="meta">
            {new Date(doc.updatedAt).toLocaleDateString('en-US')}
            <button on:click={() => deleteNote(doc)} class="btn btn-delete">delete</button>
          </span>
        </li>
      {/each}
    {/await}
  </ul>
</aside>