<script>
  import Link from '$lib/components/atoms/TiptapLinkButton.svelte'
  export let editor
</script>

<div class="toolbar">
  <button on:click={() => editor.chain().focus().toggleLang().run()} class:active={editor.isActive('lang')}>
    lang
  </button>
  <Link {editor} />
  <button on:click={() => editor.chain().focus().toggleBold().run()} class:active={editor.isActive('bold')}>
    bold
  </button>
  <button
    on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    class:active={editor.isActive('heading', { level: 2 })}
  >
    H2
  </button>
  <button
    on:click={() => editor.chain().focus().toggleHeading({ level: 3}).run()}
    class:active={editor.isActive('heading', { level: 3 })}
  >
    H3
  </button>
  <button on:click={() => editor.chain().focus().setParagraph().run()} class:active={editor.isActive('paragraph')}>
    ¶
  </button>
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
  }
</style>