<script>
  import { currentDoc } from '$lib/scripts/stores'
  export let id
  export let doc
  export let disabled
</script>
<button 
  on:click={currentDoc.set(id)}
  disabled={disabled}
>{doc.title}</button>

<style>
  button {
    background-color: transparent;
    color: var(--text-color);
  }
</style>