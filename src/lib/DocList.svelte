<script>
  import { mainService } from '$lib/scripts/mainMachine'
  import CreateDocButton from './CreateDocButton.svelte'
  import DetailsSummary from '$lib/components/molecules/DetailsSummary.svelte'
  import DocLink from '$lib/DocLink.svelte'
  import { currentID, allDocsOpened } from '$lib/scripts/stores'
</script>

<aside>
  <CreateDocButton />
  <DetailsSummary title="All Docs" isOpen={$allDocsOpened}>
    <ul id="note-list" class="nostyle">
      {#if $mainService?.context.docList.size > 0}

        {#each [...$mainService.context.docList] as [id, doc]}
          <li>
            <DocLink 
              {id} 
              {doc} 
              --text-color={$currentID == id ? 'var(--action-color)' : 'currentColor'} 
              current={$currentID == id}
            />
          </li>
        {/each}
  
      {/if}
    </ul>
  </DetailsSummary>
</aside>

<style>
  aside {
    border-bottom: 1px solid var(--accent-color);
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