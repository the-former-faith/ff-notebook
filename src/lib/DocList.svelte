<script>
  import { mainService } from '$lib/scripts/mainMachine'
  import CreateDocButton from './CreateDocButton.svelte'
  import DocLink from '$lib/DocLink.svelte'
</script>

<aside>
  <h2>All Docs</h2>
  <CreateDocButton />
  <ul id="note-list" class="nostyle">
    {#if $mainService?.context.docList.size > 0}

      {#each [...$mainService.context.docList] as [id, doc]}
        <li>
          <DocLink {id} {doc} />
        </li>
      {/each}

    {/if}
  </ul>
</aside>