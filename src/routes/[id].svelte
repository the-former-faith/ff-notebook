<script context="module">

  export async function load({ page }) {
    const id = page.params.slug

		return {
			id: id,
		}
	}

	export const prerender = true
</script>

<script>
  import DocEditor from '$lib/DocEditor.svelte'
  import { onMount } from 'svelte'
  import { db } from '$lib/stores'

  export let id
  let doc
  
  onMount(async() => {
    const db$ = await db()

    doc = await db$.notes.findOne(id).exec()
  })
</script>

<svelte:head>
	<title>{doc ? doc.toJSON().name : ''}</title>
</svelte:head>

<main>
    <h2>{doc ? doc.toJSON().name : ''}</h2>
    <DocEditor {id} />
</main>

<style>
  @media screen and (min-width: 1024px) {
    main {
      display: grid;
      grid-template-columns: 350px 1fr;
    }
  }
</style>