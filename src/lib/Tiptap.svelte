<script>
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import { currentID, currentDoc } from '$lib/scripts/stores'
  import Toolbar from '$lib/Toolbar.svelte'

  let editor
  let loadedEditor = 'empty'

  const loadDoc = async (doc, doctitle) => {
    const ydoc = new Y.Doc()
    if ($currentDoc.providerIDB) {
      await $currentDoc.providerIDB.destroy()
      console.log('destroying provider')
    }
    $currentDoc.providerIDB = new IndexeddbPersistence(doc, ydoc)
    if (editor) {
      await editor.destroy()
      console.log('destroying editor')
    }
    console.log('creating editor')
    createEditor(ydoc)
    element.append(editor.options.element)
  }

  currentID.subscribe(value => {
		if(typeof value !== 'undefined' && value !== loadedEditor) {
      //loadDoc(value)
    }
	})
  
</script>

<div>
  <p>Content</p>
  {#if $currentDoc.editor}
    <Toolbar editor={$currentDoc.editor} />
  {/if}
  <div bind:this={$currentDoc.element} class="tiptap" />
</div>
  
<style>

  .tiptap:empty {
    display: none;
  }

  .tiptap :global(.ProseMirror) {
    border: 1px solid var(--accent-color);
    padding: 0.5rem;
  }

  .tiptap :global(* + *) {
    margin-top: 0.5rem;
  }

  /* .tiptap:focus-within {
    outline: 2px solid var(--action-color);
  } */
</style>
