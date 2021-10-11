<script>
  import { mainService } from '$lib/scripts/mainMachine'
  import CreateDocButton from './CreateDocButton.svelte'
  import DocLink from '$lib/DocLink.svelte'
  import { currentID, allDocsOpened } from '$lib/scripts/stores'
</script>

<aside>
  <CreateDocButton />
  <details bind:open={$allDocsOpened}>
    <summary>All Docs</summary>
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
  </details>
</aside>

<style>
  summary {
    padding: 1rem 0.5rem;
    font-weight: bold;
    font-family: monospace, monospace;
    grid-row: 1;
    cursor: pointer;
  }

  aside {
    display: grid;
    grid-template-columns: 1fr max-content;
    border-bottom: 1px solid var(--accent-color);
  }

  details {
    display: contents;
  }

  ul {
    padding: 0%;
    list-style: none;
    display: grid;
    grid-column: 1 / -1;
  }

  li {
    border-top: 1px solid var(--accent-color);
  }
</style>