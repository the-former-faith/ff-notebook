<script>
	import '../app.css'
	import { browser } from '$app/env'
	import { mainService } from '$lib/scripts/mainMachine'
	import Sidebar from '$lib/components/organisms/Sidebar.svelte'

	$: if (browser) {
		mainService.send('BROWSER_LOADED')
		window.addEventListener('offline', () => mainService.send('TOGGLE'))
		window.addEventListener('online', () => mainService.send('TOGGLE'))
	}
</script>

<main>
  <Sidebar />
	<slot />
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  @media screen and (min-width: 1024px) {
    main {
      display: grid;
      grid-template-columns: 350px 1fr;
      align-items: start;
    }
  }
</style>
