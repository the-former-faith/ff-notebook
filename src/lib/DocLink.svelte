<script>
  import { currentID, allDocsOpened } from '$lib/scripts/stores'
  export let id
  export let doc
  export let disabled
  const updated = new Date(doc.updatedAt);
</script>
<button 
  on:click={()=> {
    $allDocsOpened = false
    currentID.set(id)
  }}

  disabled={disabled}
><span>{doc.title ? doc.title : 'Untitled Note'}</span> <small>{updated.toLocaleDateString()}</small></button>

<style>
  button {
    display: flex;
    justify-content: space-between;
    background-color: transparent;
    color: var(--text-color);
  }

  button:disabled {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>