<script context="module">
	export const prerender = true;
</script>

<script>
	let html = '<p>Write some text!</p>'
	let selection = undefined

	const handleSelection = (e) => {
		console.log(e)
	}

	const makeBold = (e) => {
		document.execCommand('bold')
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<nav class="toolbar">
	<button id='bold_btn' on:click={e => makeBold(e)}>B</button>
	<button id='italic_btn'>I</button>
</nav>

<section>
	<div 
		contenteditable="true" 
		bind:innerHTML={html}
		on:keyup={e => console.log(e)}
	></div>
</section>

<style>
	.toolbar {
		display: flex;
	}
</style>
