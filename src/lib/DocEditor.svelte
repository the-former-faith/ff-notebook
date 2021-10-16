<script>
  import Tiptap from '$lib/components/organisms/Tiptap.svelte'
  import { readableMap } from 'svelt-yjs'
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import { db, currentDoc, providerIDB } from '$lib/scripts/stores'
  import { browser } from '$app/env'

  let ydoc
  export let id

  const loadDoc = async (doc) => {
    //Lift ydoc to store so it can be destroyed
    ydoc = new Y.Doc()
    $providerIDB = new IndexeddbPersistence(doc, ydoc)
  }

  $: if(browser) loadDoc(id)

</script>
  
<div class="editor">
  {#if $currentDoc}
    <p>{$currentDoc.name}</p>
    <label for="title">Title
      <input 
        name="title"
        id="title"
        type="text" 
        value={$currentDoc.name ? $currentDoc.name : ''} 
        on:keyup={(e) => $currentDoc.update(
          {$set: {name: e.target.value}})
        }
      />
    </label>
  {/if}
  {#if $providerIDB}
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

