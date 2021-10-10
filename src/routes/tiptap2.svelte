<script>
  import { onMount, onDestroy } from 'svelte'
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import Collaboration from '@tiptap/extension-collaboration'

  let element
  let editor
  let title

  const doc73 = '209ea98e-cf49-4b4b-b019-e0df255f26f1'
  const doc75 = '9ef3cc38-2de7-4c97-b32e-a57516e1da6b'
  const doc83 = 'f8066b26-2015-45e0-9913-b97179d5c381'

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

  const loadDoc = (doc, doctitle) => {
    const ydoc = new Y.Doc()
    const provider = new IndexeddbPersistence(doc, ydoc)
    if (editor) editor.destroy() 
    title = doctitle
    createEditor(ydoc)
  }
</script>

<h1>{title ? title : 'Select Doc'}</h1>

<nav>
  <button on:click={()=> loadDoc(doc73, 'Doc73')}>Load Doc 73</button>
  <button on:click={()=> loadDoc(doc75, 'Doc75')}>Load Doc 75</button>
  <button on:click={()=> loadDoc(doc83, 'Doc83')}>Load Doc 83</button>
</nav>
  
<div class="editor" bind:this={element} />

<button on:click={()=> console.log(doc73)}>Log Doc</button>

<style>
  button {
    display: block;
    text-align: center;
  }

  .editor {
    border: 2px solid;
    min-height: 200px;
    margin-top: 1rem;
  }
  nav {
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;
  }
</style>
  