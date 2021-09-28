<script>
  import { onMount } from 'svelte';

  import { db, selectedNote, name, body } from '$lib/stores';
  let db$;
  let noteList = [];

  onMount(() => {
    const getNoteList = async () => {
      db$ = await db();
      db$.notes
        .find()
        .sort({ updatedAt: 'desc' })
        .$.subscribe((notes) => (noteList = notes));
    };
    getNoteList();
  });

  const handleEditNote = (note) => {
    selectedNote.set(note);
    name.set(note.name);
    body.set(note.body);
  };

  const deleteNote = async (note) => await note.remove();
</script>

<aside>
  <h2>All Docs</h2>
  <ul id="note-list" class="nostyle">
    {#await noteList}
      Loading Notes...
    {:then results}
      {#each results as note}
        <li>
          <span class="elipsis">
            <button on:click={() => handleEditNote(note)} class="nostyle link">{note.name}</button>
            {#if note.body !== ''}<span style="color: #757575">—</span>{/if}
            <span class="mute">
              {note.body ?? ''}
            </span>
          </span>

          <span class="meta">
            {new Date(note.updatedAt).toLocaleDateString('en-US')}
            <button on:click={() => deleteNote(note)} class="btn btn-delete">delete</button>
          </span>
        </li>
      {/each}
    {/await}
  </ul>
</aside>