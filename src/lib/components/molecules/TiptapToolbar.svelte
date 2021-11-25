<script>
  import TiptapHeaderSelect from '$lib/components/molecules/TiptapHeaderSelect.svelte'
  import TiptapModalButton from '$lib/components/molecules/TiptapModalButton.svelte'
  export let editor
  export let marks = []
</script>

<div class="toolbar">
  {#each marks as mark}

    {#if !mark.properties.attrs}
      <button 
        type="button" 
        on:click={() => editor.chain().focus().toggleMark(mark.title).run()} 
        class:active={editor.isActive(mark.title)}
      >{mark.title}
      </button>
    {:else}
      <TiptapModalButton title={mark.title} schema={mark.properties.attrs} {editor} />
    {/if}

  {/each}
  <TiptapHeaderSelect {editor} />
  <button type="button" on:click={() => editor.chain().focus().setImage().run()}>Image</button>
</div>

<style>
  button {
    text-align: center;
    justify-content: center;
  }

  .active {
    background-color: var(--action-color);
  }

  .toolbar {
    display: grid;
    grid-auto-flow: column;
    position: sticky;
    top: 0;
    background-color: var(--background-color);
    z-index: 1;
  }
</style>