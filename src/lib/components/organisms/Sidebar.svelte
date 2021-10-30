<script>
  import { allDocsOpened } from '$lib/scripts/stores'
  import DetailsSummary from '$lib/components/molecules/DetailsSummary.svelte'
  import { mainService } from '$lib/scripts/mainMachine'
  import { useSelector } from '@xstate/svelte'
  import DocList from '$lib/DocList.svelte'

  let collections

  $: if($mainService?.context.rxdb) {
    collections = useSelector($mainService.context.rxdb, (state) => state.context.collections)
  }

  $: console.log($collections)
</script>

<aside>
  <DetailsSummary title="All Docs" isOpen={$allDocsOpened}>
    {#if $collections}
      {#each Object.entries($collections) as [title, collection] }
        <DocList {title} {collection} />
      {/each}
    {/if}
  </DetailsSummary>
</aside>