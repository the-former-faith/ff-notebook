<script>
	import '../app.css'
	import { browser } from '$app/env'
	import { connectionStatusService } from '$lib/service'
	import DocList from '$lib/DocList.svelte'

	$: if (browser) {
		window.addEventListener('offline', () => connectionStatusService.send('TOGGLE'))
		window.addEventListener('online', () => connectionStatusService.send('TOGGLE'))
	}
</script>

<main>
	<p>Online status: {$connectionStatusService.value}</p>
	<DocList />
	<slot />
</main>
