<script>
  import Tiptap from '$lib/components/organisms/Tiptap.svelte'
  import { readableMap } from 'svelt-yjs'
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import { currentDoc } from '$lib/scripts/stores'
  import { browser } from '$app/env'

  let fields
  let ymap
  let ydoc
  export let id

  const loadDoc = async (doc) => {
    //Lift ydoc to store so it can be destroyed
    ydoc = new Y.Doc()
    $currentDoc.providerIDB = new IndexeddbPersistence(doc, ydoc)
    ymap = ydoc.getMap('fields')
    //Lift fields to store
    fields = readableMap(ymap)
  }

  $: if(browser) loadDoc(id)

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
    /*Will have to make the rows programatic when we use form builder*/
    grid-template-rows: repeat(2, max-content) 1fr;
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    flex: 1;
  }

  .editor > :global(*){
    grid-column: 2;
  }
</style>

