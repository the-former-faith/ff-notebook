<script>
  import { currentID } from '$lib/scripts/stores'
  export let id
  export let doc
  export let disabled
</script>
<button 
  on:click={currentID.set(id)}
  disabled={disabled}
>{doc.title}</button>

<style>
  button {
    background-color: transparent;
    color: var(--text-color);
  }
</style>