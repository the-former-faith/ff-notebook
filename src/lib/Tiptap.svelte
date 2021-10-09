<script>
  import { onDestroy } from 'svelte'
  import { browser } from '$app/env'
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import Collaboration from '@tiptap/extension-collaboration'

  export let id

  let element
  let editor

  $: if(id && browser && element) {
    console.log('hi')
    loadDoc(id)
  }

  const loadDoc = async (id) => {
    console.log('hil')
    if (editor) {
      console.log('destroying')
      await editor.destroy()
      console.log('destroyed')
    }
    const ydoc = new Y.Doc()
    const persistence = new IndexeddbPersistence(id, ydoc)
    createEditor(ydoc)
  }

  const createEditor = (doc) => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit.configure({
          history: false,
        }),
        Collaboration.configure({
          document: doc,
          field: 'content',
        })
      ],
      onTransaction: (e) => {
        // force re-render so `editor.isActive` works as expected
        editor = editor
      },
    })
  }

  onDestroy(() => {
    if (editor) {
      editor.destroy()
    }
  })

  <svelte:window
    on:sveltekit:navigation-start={() => {
      if(editor) {
        editor.destroy()
      }
    }}
  />
  
</script>

<p>{id}</p>
<div bind:this={element} class="editor" />
<button on:click={()=> editor.destroy()}>destroy</button>
  
<style>

  .editor {
    border: 2px solid;
    padding: 0.5rem;
  }

  .editor:focus-within {
    outline: 2px solid var(--accent-color);
  }
</style>
