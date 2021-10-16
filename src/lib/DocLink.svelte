<script>
  import { allDocsOpened, currentDoc } from '$lib/scripts/stores'
  export let doc
  export let current
  const updated = new Date(doc.updatedAt)
  import { goto } from '$app/navigation'

  const handleNoteSelect = (note) => {
    $allDocsOpened = false
    $currentDoc = note
  }

  const deleteNote = async (doc) => {
    if ($currentDoc?.id === doc.id) {
      goto('/')
      currentDoc.set(undefined)
    }

    await doc.remove()
  }
</script>

<div>
  <a 
    href={doc.id}
    on:click={()=> {
      handleNoteSelect(doc)
      $allDocsOpened = false
    }}

    aria-current={current}
  >
    <span>{doc.name ? doc.name : 'Untitled'}</span> 
    <small>{updated.toLocaleDateString()}</small>
  </a>
  <button on:click={() => deleteNote(doc)} class="btn btn-delete">delete</button>
</div>

<style>
  a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;
    color: var(--text-color);
    padding: 0.5rem;
    min-height: 44px;
    flex: 1;
  }

  a[aria-current='true'] {
    background-color: rgba(0, 0, 0, 0.1);
  }

  div {
    display: flex;
    align-items: center;
  }

  button {
    flex: 0
  }
</style>