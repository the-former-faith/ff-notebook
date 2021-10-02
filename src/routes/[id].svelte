<script context="module">

  export async function load({ page }) {
    const id = page.params.id

    console.log(id)

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
  import { onMount } from 'svelte'
  import { db, currentDoc } from '$lib/stores'

  export let id
  
  onMount(async() => {
    const db$ = await db()

    $currentDoc = await db$.notes.findOne(id).exec()
  })
</script>

<svelte:head>
	<title>{$currentDoc ? $currentDoc.toJSON().name : ''}</title>
</svelte:head>

<article>
  <h2>{$currentDoc ? $currentDoc.toJSON().name : ''}</h2>
  <DocEditor {id} />
</article>

<style>
  article {
    display: grid;
    gap: 1rem;
  }
</style>