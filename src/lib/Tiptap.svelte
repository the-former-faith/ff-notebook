<script>
  import { onMount, onDestroy } from 'svelte'
  import { browser } from '$app/env'
  import { mainService } from '$lib/scripts/mainMachine'

  let element
  let actorService

  //2b0f54fa-a473-439b-bfdc-5a2be570ef4b - doc 75
  //6db09fe2-c583-4801-ab25-c303c6f36283 - doc 73


  $: console.log(element)

  $: if ($actorService && browser && element) {
    element.append($actorService.context.editor.options.element)
  }

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
    // console.log('destroying')
    // if(actorService) {
    //   actorService.send('DESTROY_EDITOR')
    // }
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
    }}-->

<div class="editor">
  <p>{id}</p>
  {#if actorService}
    <div id={id} bind:this={element} class="body" />
  {/if}
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