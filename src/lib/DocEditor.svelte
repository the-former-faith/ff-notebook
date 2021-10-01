<script>
    import { name } from '$lib/stores'
    import Tiptap from '$lib/Tiptap.svelte'

    export let id
    
    const resetForm = () => {
      name.set('')
      body.set(undefined)
      currentDoc.set(undefined)
    }
  
    const saveNote = async () => {
    //   await $currentDoc
    //     .update({
    //       $set: {
    //         name: $name,
    //         body: $body,
    //         updatedAt: new Date().getTime(),
    //       },
    //     })
    //   resetForm()
    }
  </script>
  
  <div>
    <h2>NoteEditor</h2>
    {#if id}
      <input bind:value={$name} placeholder="Note Title" />
      <Tiptap {id} />
      <button on:click={saveNote}>Save Note</button>
    {/if}
  </div>
  
  <style>
    h2 {
      margin-top: 0;
    }
  
    input {
      margin: auto;
      display: block;
      width: 100%;
      margin-bottom: 10px;
      resize: vertical;
    }
  </style>