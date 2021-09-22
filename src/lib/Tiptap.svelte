<script type="module">
  import { onMount, onDestroy } from 'svelte'
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import Lang from '$lib/marks/lang'
  import Link from '@tiptap/extension-link'
  import Collaboration from '@tiptap/extension-collaboration'
  import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
  import * as Y from 'yjs'
  //import { WebsocketProvider } from 'y-websocket'
  import { readableMap } from 'svelt-yjs'

  let ywebsocket
  let element
  let editor
  let provider
  let ydoc
  ydoc = new Y.Doc()
  const ymap = ydoc.getMap('fields')
  const fields = readableMap(ymap)
  let awareness

  onMount(async() => {
    ywebsocket = await import ('y-websocket')
    provider = new ywebsocket.WebsocketProvider('wss://ff-server.onrender.com:1200', 'example-document-2', ydoc)

    awareness = provider.awareness

    editor = new Editor({
      element: element,
      extensions: [
        StarterKit.configure({
          history: false,
        }),
        Lang,
        Link.configure({
          openOnClick: false,
        }),
        Collaboration.configure({
          document: ydoc,
          field: 'content',
        }),
        CollaborationCursor.configure({
          provider: provider,
          user: {
            name: 'Cyndig Lauper',
            color: '#f783ac',
          },
        }),
      ],
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

    if (provider) {
      provider.destroy()
    }
  })
</script>


<input type="text" value={$fields.get('title') ? $fields.get('title') : ''} on:keyup={(e) => fields.y.set('title', e.target.value)}/>

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
  <button on:click={() => logContent()}>
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
  