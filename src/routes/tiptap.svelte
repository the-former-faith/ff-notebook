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

  const doc73 = new Y.Doc()
  const provider73 = new IndexeddbPersistence('6db09fe2-c583-4801-ab25-c303c6f36283', doc73)
  const doc75 = new Y.Doc()
  const provider75 = new IndexeddbPersistence('2b0f54fa-a473-439b-bfdc-5a2be570ef4b', doc73)

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
    if (editor) editor.destroy() 
    title = doctitle
    createEditor(doc)
  }
</script>

<h1>{title ? title : 'Select Doc'}</h1>

<nav>
  <button on:click={()=> loadDoc(doc73, 'Doc73')}>Load Doc 73</button>
  <button on:click={()=> loadDoc(doc75, 'Doc75')}>Load Doc 75</button>
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
  