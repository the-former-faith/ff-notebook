<script>
  import { allDocsOpened } from '$lib/scripts/stores'
  import DetailsSummary from '$lib/components/molecules/DetailsSummary.svelte'
  import { mainService } from '$lib/scripts/mainMachine'
  import { useSelector } from '@xstate/svelte'
  import DocList from '$lib/DocList.svelte'

  let collections

  let images
  let posts

  $: if($mainService?.context.rxdb) {
    collections = useSelector($mainService.context.rxdb, (state) => state.context.collections)
  }

  $: if($collections) {
    console.log($collections)
    posts = $collections.posts
    images = $collections.images
  }
</script>

<aside>
  <DetailsSummary title="All Docs" isOpen={$allDocsOpened}>
    {#if $posts}
        <DocList title="posts" collection={$posts}/>
    {/if}
    {#if $images}
        <DocList title="images" collection={$images}/>
    {/if}
  </DetailsSummary>
</aside>