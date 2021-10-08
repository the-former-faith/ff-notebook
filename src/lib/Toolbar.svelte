<script>
  export let editor

  const setLink = (editor) => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .run()

      return
    }

    // update link
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }
</script>

<div class="toolbar">
  <button on:click={() => editor.chain().focus().toggleLang().run()} class:active={editor.isActive('lang')}>
    lang
  </button>
  <button on:click={() => setLink()} class:active={editor.isActive('link')}>
    link
  </button>
  {#if editor.isActive('link')}
    <button on:click={() => editor.chain().focus().unsetLink().run()} >
      unsetLink
    </button>
  {/if}
  <button on:click={() => editor.chain().focus().toggleBold().run()} class:active={editor.isActive('bold')}>
    bold
  </button>
  <button
    on:click={() => editor.chain().focus().toggleHeading({ level: 1}).run()}
    class:active={editor.isActive('heading', { level: 1 })}
  >
    H1
  </button>
  <button
    on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    class:active={editor.isActive('heading', { level: 2 })}
  >
    H2
  </button>
  <button on:click={() => editor.chain().focus().setParagraph().run()} class:active={editor.isActive('paragraph')}>
    P
  </button>
  <button on:click={() => console.log(editor.getJSON())}>
    Log content
  </button>
</div>

<style>
  button.active {
    background: black;
    color: white;
  }

  .toolbar {
    display: flex;
  }
</style>