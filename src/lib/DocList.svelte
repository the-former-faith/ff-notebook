<script>
  import { onMount } from 'svelte'
  import { db, currentDoc, allDocsOpened } from '$lib/scripts/stores'
  import DetailsSummary from '$lib/components/molecules/DetailsSummary.svelte'

  import CreateDocButton from './CreateDocButton.svelte'
  import DocLink from '$lib/DocLink.svelte'
  import { v1 as uuidv1 } from 'uuid'
  import { goto } from '$app/navigation'
  import { mainService } from '$lib/scripts/mainMachine'
  import { useSelector } from '@xstate/svelte'

  let collections
  let posts

  $: console.log($posts)

  $: if($mainService?.context.rxdb) {
    collections = useSelector($mainService.context.rxdb, (state) => state.context.collections);
  }

  $: if($collections) {
    posts = $collections.posts
  }
</script>

<CreateDocButton />
<DetailsSummary title="All Docs" isOpen={$allDocsOpened}>
  <ul id="note-list" class="nostyle">
    {#if $posts}
      {#each $posts as doc}
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
<button on:click={()=> console.log($posts)}>Log me</button>

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