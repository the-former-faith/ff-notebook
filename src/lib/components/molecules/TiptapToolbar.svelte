<script>
  import Link from '$lib/components/atoms/TiptapLinkButton.svelte'
  import TiptapHeaderSelect from '$lib/components/molecules/TiptapHeaderSelect.svelte'
  export let editor
</script>

<div class="toolbar">
  <button on:click={() => editor.chain().focus().toggleBold().run()} class:active={editor.isActive('bold')}>
    B<span class="screen-reader-text">old</span>
  </button>
  <Link {editor} />
  <TiptapHeaderSelect {editor} />
  <button on:click={() => editor.chain().focus().setImage().run()}>Image</button>
  <!-- <button on:click={() => editor.chain().focus().toggleLang().run()} class:active={editor.isActive('lang')}>
    lang
  </button> -->
</div>

<style>
  button {
    text-align: center;
    justify-content: center;
  }

  button.active {
    background: var(--action-color);
    color: white;
  }

  .toolbar {
    display: grid;
    grid-auto-flow: column;
    gap: 0.5rem;
    position: sticky;
    top: 0;
    background-color: var(--accent-color);
    z-index: 1;
    padding: 0.5rem;
    grid-column: 1 / -1 !important;
    /*overflow-x: auto;*/
  }
</style>