<script context="module">
	export const prerender = true
	import Tiptap from '$lib/Tiptap.svelte'
	import DocList from '$lib/DocList.svelte'
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<main>
	<DocList />
	<Tiptap />
</main>

<style>
  @media screen and (min-width: 1024px) {
    main {
      display: grid;
      grid-template-columns: 350px 1fr;
    }
  }
</style>
