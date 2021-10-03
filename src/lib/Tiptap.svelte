<script>
  import { onMount, onDestroy } from 'svelte'
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import Lang from '$lib/marks/lang'
  import Link from '@tiptap/extension-link'
  import Collaboration from '@tiptap/extension-collaboration'
  import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
  import { body } from '$lib/stores.js'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import * as Y from 'yjs'

  let ywebsocket
  let element
  let editor
  let provider
  let ydoc
  let awareness
  let persistence

  export let id

  //$: if(ywebsocket) loadDoc(id)

  // $: if(!$online && provider) {
  //   provider.destroy()
  //   console.log('destroying provider')
  // } else if ($online && ywebsocket) {
  //   console.log('creating provider')
  //   provider = new ywebsocket.WebsocketProvider('wss://ff-server.onrender.com', id, ydoc)
  // }

  onMount(async() => {
    ywebsocket = await import ('y-websocket')
  })

  const loadDoc = async(id) => {
      console.log('page id: ', id)
      if (editor) {
        await editor.destroy()
      }

      if (provider) {
        await provider.destroy()
      }

      ydoc = new Y.Doc()
      provider = new ywebsocket.WebsocketProvider('wss://ff-server.onrender.com', id, ydoc)
      persistence = new IndexeddbPersistence(id, ydoc)
      createEditor()
      awareness = provider.awareness

      persistence.on('synced', () => {
        console.log('doc is loaded: ', ydoc)
      })
  }

  const createEditor = () => {
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
      onUpdate() {
        const json = this.getJSON()
        body.set(json.content)
      },
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

<div class="editor">

  {#if editor}
    <!--<input type="text" value={$fields.get('title') ? $fields.get('title') : ''} on:keyup={(e) => fields.y.set('title', e.target.value)}/>-->


  {/if}
    
  <div bind:this={element} class="body" />

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