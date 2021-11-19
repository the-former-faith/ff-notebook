<script context="module">
  export const prerender = false
  export async function load({ page }) {

		return {
      props: page.params
		}
	}
</script>

<script>
  //import DocEditor from '$lib/DocEditor.svelte'

  export let id
  export let collection
</script>

<svelte:head>
	<!--<title>{$currentID ? $currentID.toJSON().name : ''}</title>-->
</svelte:head>

<article>
  <!--<DocEditor {id} {collection} />-->
</article>

<style>
  article {
    display: grid;
    gap: 1rem;
    flex: 1;
  }
</style>