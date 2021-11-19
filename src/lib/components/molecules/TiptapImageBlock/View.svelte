<script>
	import { NodeViewWrapper, editable } from 'svelte-tiptap'

	export let node
	export let updateAttributes

	$: console.log(node.attrs)
</script>

<NodeViewWrapper class="svelte-component">
  <p>Image</p>
  <!--@TODO: Add options to create new or select-->
  <!--@TODO: Add list for selecting-->
  <!--Use XState to help with process-->

	<!-- Content is inserted here -->
  <!--@TODO: figure out how to limit what can go in content editable-->
	<div use:editable class="content editable" />
</NodeViewWrapper>

<style>
	:global(.svelte-component) {
		background-color: lightgoldenrodyellow;
		padding: 1rem;
	}
</style>