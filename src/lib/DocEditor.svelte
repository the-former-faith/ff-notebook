<script>
  import Tiptap from '$lib/components/organisms/Tiptap.svelte'
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import { currentDoc, providerIDB } from '$lib/scripts/stores'
  import { mainService } from '$lib/scripts/mainMachine'
  import { useSelector } from '@xstate/svelte'
  import { browser } from '$app/env'
  import { onMount } from 'svelte';

  let ydoc
  let collections
  export let id
  export let collection

  $: if($mainService?.context.rxdb) {

    collections = useSelector($mainService.context.rxdb, (state) => state.context.db)
    if(!$currentDoc && $collections && $collections[collection]) {
      console.log($collections)
      $collections[collection].findOne(id)
      .exec()
      .then(doc => $currentDoc = doc)
    }
  }

  const loadDoc = async (doc) => {
    //Lift ydoc to store so it can be destroyed
    ydoc = new Y.Doc()
    $providerIDB = new IndexeddbPersistence(doc, ydoc)
  }

  $: if(browser) loadDoc(id)

  //@TODO: make this work with any field
  const clearField = (node, currentDoc) => {
    return {
			update(currentDoc) {
        node.value = currentDoc.name
			},
    } 
  }

</script>

<div class="editor">
  {#if $currentDoc}
    <label for="title">Title
      <input 
        name="title"
        id="title"
        type="text" 
        value={$currentDoc.get('name') ? $currentDoc.get('name') : ''} 
        on:keyup={(e) => $currentDoc.atomicPatch({name: e.target.value})}
        use:clearField={$currentDoc}
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

