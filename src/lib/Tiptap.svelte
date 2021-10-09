<script>
  import { onDestroy } from 'svelte'
  import { browser } from '$app/env'
  import { mainService } from '$lib/scripts/mainMachine'

  let element

  export let id

  $: if(element && $mainService?.context.currentDoc) {
    element.append($mainService?.context.currentDoc.options.element)
  }

  onDestroy(() => {
    //Send message to destroy editor
  })

  
</script>

<p>{id}</p>
<div bind:this={element} class="editor" />
  
<style>

  .editor {
    border: 2px solid;
    padding: 0.5rem;
  }

  .editor:focus-within {
    outline: 2px solid var(--accent-color);
  }
</style>