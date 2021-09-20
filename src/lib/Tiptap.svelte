<script type="module">
    import { onMount, onDestroy } from 'svelte'
    import { Editor } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'
    import Lang from '$lib/marks/lang'
    import Link from '@tiptap/extension-link'
  
    let element
    let editor
  
    onMount(() => {
      editor = new Editor({
        element: element,
        extensions: [
          StarterKit,
          Lang,
          Link.configure({
            openOnClick: false,
          })
        ],
        content: '<p>Hello World! 🌍️ </p>',
        onTransaction: () => {
          // force re-render so `editor.isActive` works as expected
          editor = editor
        },
      })
    })


    const setLink = () => {
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


    const logContent = () => console.log(editor.getJSON())
  
    onDestroy(() => {
      if (editor) {
        editor.destroy()
      }
    })
  </script>
  
  {#if editor}
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
    <button
    on:click={() => logContent()}
  >
    Log content
  </button>
  {/if}
  
  <div bind:this={element} />
  
  <style>
    button.active {
      background: black;
      color: white;
    }
  </style>
  