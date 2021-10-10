<script>
  import Tiptap from '$lib/Tiptap.svelte'
  import { readableMap } from 'svelt-yjs'
  import * as Y from 'yjs'
  import { currentDoc } from '$lib/scripts/stores'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import { onMount } from 'svelte'

  let value
  const ydoc = new Y.Doc()
  let provider
  let fields
  let ymap

  onMount(()=> {
    ymap = ydoc.getMap('fields')
    fields = readableMap(ymap)
    provider = new IndexeddbPersistence('9e6b8fac-e059-419b-91fe-4fb31b928d6a', ydoc)
    fields.y.set('title', '')
  })
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

