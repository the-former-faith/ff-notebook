<script>
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
  import { currentDoc } from '$lib/stores.js';

  let ywebsocket
  let element
  let editor
  let provider
  let ymap
  let fields
  let awareness

  $: {
    if($currentDoc && ywebsocket) {
      console.log($currentDoc)
      if (editor) {
        editor.destroy()
      }

      if (provider) {
        provider.destroy()
      }
      //@todo - Change from 'example-document' to actual document
      provider = new ywebsocket.WebsocketProvider('wss://ff-server.onrender.com', 'example-document', $currentDoc)
      createEditor()
      awareness = provider.awareness
    }
  }

  onMount(async() => {
    ywebsocket = await import ('y-websocket')
  })

  const createEditor = () => {
    ymap = $currentDoc.getMap('fields')
    fields = readableMap(ymap)

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
          document: $currentDoc,
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
  }


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

  onDestroy(() => {
    if (editor) {
      editor.destroy()
    }

    if (provider) {
      provider.destroy()
    }
  })
</script>

<div>

{#if editor}
  <input type="text" value={$fields.get('title') ? $fields.get('title') : ''} on:keyup={(e) => fields.y.set('title', e.target.value)}/>

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
{/if}
  
<div bind:this={element} />
</div>
  
<style>
  button.active {
    background: black;
    color: white;
  }
</style>