<script>
  import { onMount } from 'svelte'
  import { db, currentDoc, allDocsOpened, collections } from '$lib/scripts/stores'
  import DetailsSummary from '$lib/components/molecules/DetailsSummary.svelte'

  import CreateDocButton from './CreateDocButton.svelte'
  import DocLink from '$lib/DocLink.svelte'
  import { v1 as uuidv1 } from 'uuid'
  import { goto } from '$app/navigation'
  import { mainService } from '$lib/scripts/mainMachine'
  import { useSelector } from '@xstate/svelte'

  let noteList = []
  let test

  $: console.log($test)

  $: if($mainService?.context.rxdb) {
    if (noteList.length == 0) {
      test = useSelector($mainService.context.rxdb, (state) => state.context);
    }
  }
</script>

<CreateDocButton />
<DetailsSummary title="All Docs" isOpen={$allDocsOpened}>
  <ul id="note-list" class="nostyle">
    {#await noteList}
      Loading Notes...
    {:then results}
      {#each results as doc}
        <li>
          <DocLink 
            {doc} 
            --text-color={$currentDoc?.id == doc.id ? 'var(--action-color)' : 'currentColor'} 
            current={$currentDoc?.id == doc.id}
          />
        </li>
      {/each}
    {/await}
  </ul>
</DetailsSummary>
<button on:click={()=> console.log($test)}>Log me</button>

<style>
  ul {
    padding: 0;
    list-style: none;
    display: grid;
  }
  
  li {
    border-top: 1px solid var(--accent-color);
  }
</style>