<script>
  import { onDestroy, onMount } from 'svelte'
  import { browser } from '$app/env'
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import Collaboration from '@tiptap/extension-collaboration'
  import { currentDoc } from '$lib/scripts/stores'
  import Tiptap from '$lib/Tiptap.svelte'

  let element
  let editor
  let loadedEditor = 'empty'

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
        //editor = editor
      },
    })
  }

  const loadDoc = async (doc, doctitle) => {
    const ydoc = new Y.Doc()
    const provider = new IndexeddbPersistence(doc, ydoc)
    if (editor) {
      await editor.destroy()
      console.log('destroying editor')
    }
    console.log('creating editor')
    createEditor(ydoc)
  }

  currentDoc.subscribe(value => {
    console.log(value)
		if(typeof value !== 'undefined' && value !== loadedEditor) {
      loadDoc(value)
    }
	})
  
</script>

<div bind:this={element} class="editor" />
  
<style>

  .editor {
    border: 2px solid;
    padding: 0.5rem;
  }

  .editor:focus-within {
    outline: 2px solid var(--accent-color);
  }
</style>
