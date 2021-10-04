<script>
	import '../app.css'
	import { browser } from '$app/env'
	import { mainService } from '$lib/scripts/service'
	import DocList from '$lib/DocList.svelte'

	$: if (browser) {
		window.addEventListener('offline', () => mainService.send('TOGGLE'))
		window.addEventListener('online', () => mainService.send('TOGGLE'))
	}
</script>

<!--<p>Online status: {$mainService.value.connectionStatus}</p>-->
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
