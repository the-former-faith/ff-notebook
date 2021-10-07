<script>
  import { mainService } from '$lib/scripts/mainMachine'
  //import CreateDocButton from './CreateDocButton.svelte'
  import DocLink from '$lib/DocLink.svelte'

  const deleteNote = async (doc) => {
    await doc.remove()
  }
</script>

<aside>
  <h2>All Docs</h2>
  <button on:click={ ()=> mainService.send({ type: 'CREATE' }) }>New Doc</button>
  <button on:click={ ()=> console.log($mainService) }>Log Machine</button>
  <!--<CreateDocButton />-->
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