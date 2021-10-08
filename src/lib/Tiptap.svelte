<script>
  import { onMount, onDestroy } from 'svelte'
  import { mainService } from '$lib/scripts/mainMachine'
import { log } from 'xstate/lib/actions';

  let element = null
  let actorService

  export let id

  onMount(()=> {
    console.log('mounting')
    const actors = $mainService.context.editors
    const actorExists = actors.find(o => o.id === id)
    if (actorExists) {
      actorService = actorExists.ref
      actorService.send({ type: 'CREATE_EDITOR', element: element})
    } else {
      mainService.send('NEW_EDITOR.ADD', {id: id})
    }
  })

  mainService.onTransition((state) => {
    if(state.changed) {
      if(state.event.type == 'NEW_EDITOR.ADD') {
        const actors = state.context.editors
        const actorExists = actors.find(o => o.id === id)
        if (actorExists) {
          actorService = actorExists.ref
          actorExists.ref.send({ type: 'CREATE_EDITOR', element: element})
        }
      }
    }
  })
  
  //$:console.log($actorService)

  //$: if(ywebsocket) loadDoc(id)

  // $: if(!$online && provider) {
  //   provider.destroy()
  //   console.log('destroying provider')
  // } else if ($online && ywebsocket) {
  //   console.log('creating provider')
  //   provider = new ywebsocket.WebsocketProvider('wss://ff-server.onrender.com', id, ydoc)
  // }

  // const loadDoc = async(id) => {
  //     console.log('page id: ', id)
  //     if (editor) {
  //       await editor.destroy()
  //     }

  //     if (provider) {
  //       await provider.destroy()
  //     }
  // }

  onDestroy(() => {
    console.log('destroying')
    if(actorService) {
      actorService.send('DESTROY_EDITOR')
    }
    // if (editor) {
    //   editor.destroy()
    // }

    // if (provider) {
    //   provider.destroy()
    // }
  })
</script>

<!--This successfully destroys the editor, but it does not recreate an editor.
  <svelte:window
    on:sveltekit:navigation-start={() => {
      console.log('navigating!')
      if(actorService) {
        actorService.send('DESTROY_EDITOR')
      }
    }}
/>-->

<div class="editor">
  <p>{id}</p>
  <div bind:this={element} class="body" />
</div>
  
<style>

  .editor {
    border: 2px solid;
  }

  .editor:focus-within {
    outline: 2px solid var(--accent-color);
  }

  .body {
    padding: 0.5rem;
  }
</style>