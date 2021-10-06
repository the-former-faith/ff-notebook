<script>
  import { createMachine, interpret, send } from 'xstate'
	import { browser } from '$app/env'

  import DbWorker from '$lib/scripts/db-worker.js?worker'
  import { fromWebWorker } from '$lib/scripts/from-web-worker.js'

  let myList
  let testService

  if(browser) {

    const testMachine = createMachine({
      id: 'testMachine',
      initial: 'loggedIn',
      context: {
        docList: undefined,
      },
      states: {
        loggedIn: {
          invoke: {
            id: 'db',
            src: fromWebWorker(() => new DbWorker() ),
          },
          on: {
            CREATE: {
              actions: [send({ type: 'CREATE' }, { to: 'db' })],
            },
          },
        },
        loggedOut: {}
      }
    })

    testService = interpret(testMachine).start()

  }

</script>

<div>

<button on:click={ ()=> testService.send({ type: 'CREATE' }) }>New Doc</button>
<button on:click={ ()=> console.log($testService) }>Log Machine</button>

{#if $testService?.context.docList}
  <h1>Test</h1>
  <ul>
    {#each $testService.context.docList as [key, value]}
      <li>
        <button>{key}</button>
      </li>
    {/each}
  </ul>
{/if}
</div>