<script>
  import { mainService } from '$lib/scripts/mainMachine'
  import CreateDocButton from './CreateDocButton.svelte'
  import DocLink from '$lib/DocLink.svelte'
  import { currentDoc } from '$lib/scripts/stores'
</script>

<aside>
  <details>
    <summary>All Docs</summary>
    <ul id="note-list" class="nostyle">
      <li>
        <CreateDocButton />
      </li>
      {#if $mainService?.context.docList.size > 0}
  
        {#each [...$mainService.context.docList] as [id, doc]}
          <li>
            <DocLink 
              {id} 
              {doc} 
              --text-color={$currentDoc == id ? 'var(--action-color)' : 'currentColor'} 
              disabled={$currentDoc == id}
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
  }

  details {
    border-bottom: 1px solid var(--accent-color);
  }

  ul {
    padding: 0%;
    list-style: none;
    display: grid;
  }

  li:not(:last-of-type):not(:first-of-type) {
    border-bottom: 1px solid var(--accent-color);
  }
</style>