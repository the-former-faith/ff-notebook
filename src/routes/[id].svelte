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
	<!--<title>{$currentDoc ? $currentDoc.toJSON().name : ''}</title>-->
</svelte:head>

<article>
  <!--<h2>{$currentDoc ? $currentDoc.toJSON().name : ''}</h2>-->
  <DocEditor {id} />
</article>

<style>
  article {
    display: grid;
    gap: 1rem;
  }
</style>