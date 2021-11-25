<script>
  import { currentDoc } from '$lib/scripts/stores'
  import DetailsSummary from '$lib/components/molecules/DetailsSummary.svelte'
  import CreateDocButton from '$lib/components/atoms/CreateDocButton.svelte'
  import DocLink from '$lib/components/molecules/DocLink.svelte'
  export let collection
  export let title
</script>

<div>
  <CreateDocButton collection={title} />
  <DetailsSummary {title} isOpen={true}>
    <ul id="note-list" class="nostyle">
      {#if $collection}
        {#each $collection as doc}
          <li>
            <DocLink 
              {doc} 
              --text-color={$currentDoc?.id == doc.id ? 'var(--action-color)' : 'currentColor'} 
              current={$currentDoc?.id == doc.id}
            />
          </li>
        {/each}
      {/if}
    </ul>
  </DetailsSummary>
</div>

<style>
  div {
    position: relative;
  }

  ul {
    padding: 0;
    list-style: none;
    display: grid;
  }
  
  li {
    border-top: 1px solid var(--accent-color);
  }
</style>