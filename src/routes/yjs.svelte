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
        docList: new Map(),
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
            NEWDOC: {
              actions: [(context, event) => context.docList.set(event.data.id, event.data.title)],
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

{#if $testService?.context.docList.size > 0}
  <h1>Test</h1>
  <ul>
    {#each [...$testService.context.docList] as [key, value]}
      <li>
        <button>{value}</button>
      </li>
    {/each}
  </ul>
{/if}
</div>