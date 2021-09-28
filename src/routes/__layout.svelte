<script>
	import '../app.css'
	import { browser } from '$app/env'
	import { online } from '$lib/stores.js'
	import DocList from '$lib/DocList.svelte'

	$: if (browser) {
		$online = window.navigator.onLine
		window.addEventListener('offline', (e) => $online = false)
		window.addEventListener('online', (e) => $online = true)
	}
</script>

<main>
	<DocList />
	<slot />
</main>
