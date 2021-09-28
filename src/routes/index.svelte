<script context="module">
	export const prerender = true
	import Tiptap from '$lib/Tiptap.svelte'
  import DocEditor from '$lib/DocEditor.svelte'
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<main>
	<DocEditor />
</main>

<style>
  @media screen and (min-width: 1024px) {
    main {
      display: grid;
      grid-template-columns: 350px 1fr;
    }
  }
</style>
