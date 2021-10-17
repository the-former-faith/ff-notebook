<script>
	import '../app.css'
	import { browser } from '$app/env'
	import { mainService } from '$lib/scripts/mainMachine'
	import DocList from '$lib/DocList.svelte'
import { children } from 'svelte/internal';

  //$: console.log($mainMachineState)

	$: if (browser) {
		mainService.send('BROWSER_LOADED')
		window.addEventListener('offline', () => mainService.send('TOGGLE'))
		window.addEventListener('online', () => mainService.send('TOGGLE'))
	}
</script>

<button on:click={()=> console.log(mainService.state)}>Log me</button>
<!--<p>Online status: {$mainMachineState.value.connectionStatus}</p>-->
<main>
  <aside>
    <DocList />
  </aside>
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
