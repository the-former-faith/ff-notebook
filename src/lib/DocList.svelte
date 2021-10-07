<script>
  import { mainService } from '$lib/scripts/mainMachine'
  import { browser } from '$app/env'
  //import CreateDocButton from './CreateDocButton.svelte'
  import DocLink from '$lib/DocLink.svelte'
  import { onMount } from 'svelte';

  $: if (browser) {
    console.log('brwoser')
    mainService.send('BROWSER_LOADED')
  }

  onMount

  const deleteNote = async (doc) => {
    // if ($currentDoc.get('id') === doc.id) {
    //   currentDoc.set(undefined)
    // }

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