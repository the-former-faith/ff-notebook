<script>
  export let collection
</script>

<!--@TODO: Filter out current doc, so no self referencing-->
{#if $collection}
  {#each $collection as doc}
    <option value={doc.id}>{doc.title}</option>
  {/each}
{/if}