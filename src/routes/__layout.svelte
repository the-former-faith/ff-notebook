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

<p>Online status: {$connectionStatusService.value}</p>
<main>
	<DocList />
	<slot />
</main>

<style>
  @media screen and (min-width: 1024px) {
    main {
      display: grid;
      grid-template-columns: 350px 1fr;
    }
  }
</style>
