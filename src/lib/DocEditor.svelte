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

  let fields
  let ymap
  let loadedEditor = 'empty'
  let ydoc = new Y.Doc()

  const loadDoc = async (doc) => {
    //Lift ydoc to store so it can be destroyed
    ydoc = new Y.Doc()
    // if ($currentDoc.providerIDB) {
    //   await $currentDoc.providerIDB.destroy()
    // }
    $currentDoc.providerIDB = new IndexeddbPersistence(doc, ydoc)
    ymap = ydoc.getMap('fields')
    //Lift fields to store
    fields = readableMap(ymap)
  }

  currentID.subscribe(value => {
		if(typeof value !== 'undefined' && value !== loadedEditor) {
      loadDoc(value)
    }
	})

  // onMount(()=> {
  //   provider = new IndexeddbPersistence('9e6b8fac-e059-419b-91fe-4fb31b928d6a', ydoc)
  //   fields.y.set('title', '')
  // })
</script>
  
<div class="editor">
  {#if $fields}
    <label for="title">Title
      <input 
        name="title"
        id="title"
        type="text" 
        value={$fields.get('title') ? $fields.get('title') : ''} 
        on:keyup={(e) => fields.y.set('title', e.target.value)}
      />
    </label>
  {/if}
  {#if $currentDoc.providerIDB}
    <Tiptap {ydoc} />
  {/if}
</div>

<style>
  .editor {
    display: grid;
    grid-template-columns: 0 1fr 0;
    gap: 1rem;
  }

  .editor > :global(*){
    grid-column: 2;
  }
</style>

