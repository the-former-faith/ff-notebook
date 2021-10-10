<script>
  import { currentID } from '$lib/scripts/stores'
  export let id
  export let doc
  export let disabled
  const updated = new Date(doc.updatedAt);
</script>
<button 
  on:click={currentID.set(id)}
  disabled={disabled}
><span>{doc.title ? doc.title : 'Untitled Note'}</span> <small>{updated.toLocaleDateString()}</small></button>

<style>
  button {
    display: flex;
    justify-content: space-between;
    background-color: transparent;
    color: var(--text-color);
  }
</style>