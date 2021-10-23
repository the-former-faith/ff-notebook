<script>
	import { NodeViewWrapper, editable } from 'svelte-tiptap';

	export let node;
	export let updateAttributes;
	let files;

	$: console.log(node.attrs);
	$: console.log(files);
</script>

<NodeViewWrapper class="svelte-component">
	<label for="avatar">Choose a profile picture:</label>
	<input
		type="file"
		id="avatar"
		name="avatar"
		accept="image/*"
		bind:files
		on:change={(e) => console.log(e)}
	/>

	<!-- Content is inserted here -->
	<div use:editable class="content editable" />
</NodeViewWrapper>

<style>
	:global(.svelte-component) {
		background-color: lightgoldenrodyellow;
		padding: 1rem;
	}
</style>
