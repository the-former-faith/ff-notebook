<script>
  import { currentDoc } from '$lib/scripts/stores'
  export let id
  export let doc
</script>
<button on:click={currentDoc.set(id)} >{doc.title}</button>