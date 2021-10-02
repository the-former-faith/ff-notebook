<script>
	import '../app.css'
	import { browser } from '$app/env'
	import { connectionStatusService } from '$lib/service'
	import DocList from '$lib/DocList.svelte'

  // src/index.js
  import { onMount } from 'svelte'
  import { wrap } from "comlink/dist/esm/comlink.mjs"
  import SyncWorker from '$lib/worker.js?worker'

	//Test
  onMount(async()=> {
		const worker = new SyncWorker()
    const obj = wrap(worker);

    obj.inc().then(count => {
      console.log('count', count);
      // count 1
    });
  })

	//End test

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
