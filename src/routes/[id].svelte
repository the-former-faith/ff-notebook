<script context="module">
  export async function load({ page }) {
    const id = page.params.id

		return {
      props: {
			  id: id
      }
		}
	}

	export const prerender = true
</script>

<script>
  import { currentID } from '$lib/scripts/stores'
  import DocEditor from '$lib/DocEditor.svelte'

  export let id

  $currentID = id
  
</script>

<svelte:head>
	<!--<title>{$currentID ? $currentID.toJSON().name : ''}</title>-->
</svelte:head>

<article>
  <!--<h2>{$currentID ? $currentID.toJSON().name : ''}</h2>-->
  <DocEditor {id} />
</article>

<style>
  article {
    display: grid;
    gap: 1rem;
  }
</style>