<script>
  import TiptapHeaderSelect from '$lib/components/molecules/TiptapHeaderSelect.svelte'
  import TiptapModalButton from '$lib/components/molecules/TiptapModalButton.svelte'
  export let editor

  function isEmptyObject(obj){
    return JSON.stringify(obj) === '{}'
  }

  const marks = editor.extensionManager.schema.marks

  console.log(marks)
</script>

<div class="toolbar">
  {#each Object.entries(marks) as [title, mark] }

    {#if isEmptyObject(mark.attrs)}
      <button 
        type="button" 
        on:click={() => editor.chain().focus().toggleMark(title).run()} 
        class:active={editor.isActive(title)}
      >{title}
      </button>
    {:else}
      <TiptapModalButton {title} {mark} {editor} />
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