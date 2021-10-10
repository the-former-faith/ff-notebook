<script>
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import Collaboration from '@tiptap/extension-collaboration'
  import Tiptap from '$lib/Tiptap.svelte'
  import { readableMap } from 'svelt-yjs'
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import { onMount } from 'svelte'
  import { currentID, currentDoc } from '$lib/scripts/stores'

  let value
  const ydoc = new Y.Doc()
  let provider
  let fields
  let ymap
  let loadedEditor = 'empty'

  const createEditor = (doc) => {
    $currentDoc.editor = new Editor({
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
    if ($currentDoc.providerIDB) {
      await $currentDoc.providerIDB.destroy()
      console.log('destroying provider')
    }
    $currentDoc.providerIDB = new IndexeddbPersistence(doc, ydoc)
    if ($currentDoc.editor) {
      await $currentDoc.editor.destroy()
      console.log('destroying editor')
    }
    console.log('creating editor')
    createEditor(ydoc)
    $currentDoc.element.append($currentDoc.editor.options.element)
  }

  currentID.subscribe(value => {
		if(typeof value !== 'undefined' && value !== loadedEditor) {
      loadDoc(value)
    }
	})

  // onMount(()=> {
  //   ymap = ydoc.getMap('fields')
  //   fields = readableMap(ymap)
  //   provider = new IndexeddbPersistence('9e6b8fac-e059-419b-91fe-4fb31b928d6a', ydoc)
  //   fields.y.set('title', '')
  // })
</script>
  
<div class="editor">
  <!-- {#if $fields}
    <label for="title">Title
      <input 
        name="title"
        id="title"
        type="text" 
        value={$fields.get('title') ? $fields.get('title') : ''} 
        on:keyup={(e) => fields.y.set('title', e.target.value)}
      />
    </label>
  {/if} -->
  <Tiptap />
  <button on:click={console.log(ydoc)}>Log Y Doc</button>
</div>

<style>
  .editor {
    padding: 0.5rem;
    display: grid;
    gap: 0.5rem;
  }
</style>

