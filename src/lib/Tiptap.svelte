<script>
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import Collaboration from '@tiptap/extension-collaboration'
  import { currentDoc } from '$lib/scripts/stores'

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
		if(typeof value !== 'undefined' && value !== loadedEditor) {
      loadDoc(value)
    }
	})
  
</script>

<div>
  <p>Content</p>
  <div bind:this={element} class="tiptap" />
</div>
  
<style>

  .tiptap {
    border: 1px solid var(--accent-color);
    padding: 0.5rem;
  }

  .tiptap:empty {
    display: none;
  }

  .tiptap:focus-within {
    outline: 2px solid var(--action-color);
  }
</style>
