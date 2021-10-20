<script>
  import { currentDoc } from './scripts/stores'
  import DetailsSummary from '$lib/components/molecules/DetailsSummary.svelte'
  import CreateDocButton from './CreateDocButton.svelte'
  import DocLink from '$lib/DocLink.svelte'
  export let collection
  export let title
</script>

<div>
  <CreateDocButton collection={title} />
  <DetailsSummary {title} isOpen={true}>
    <ul id="note-list" class="nostyle">
        {#each collection as doc}
          <li>
            <DocLink 
              {doc} 
              --text-color={$currentDoc?.id == doc.id ? 'var(--action-color)' : 'currentColor'} 
              current={$currentDoc?.id == doc.id}
            />
          </li>
        {/each}
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