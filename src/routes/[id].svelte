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
  import DocEditor from '$lib/DocEditor.svelte'

  export let id
  
</script>

<svelte:head>
	<!--<title>{$currentID ? $currentID.toJSON().name : ''}</title>-->
</svelte:head>

<article>
  <DocEditor {id} />
</article>

<style>
  article {
    display: grid;
    gap: 1rem;
    flex: 1;
  }
</style>