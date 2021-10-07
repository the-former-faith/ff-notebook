<script>
    import Tiptap from '$lib/Tiptap.svelte'

    export let id
  
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
  
  <h2>NoteEditor</h2>
  {#if id}
    <!--<input bind:value={$name} placeholder="Note Title" />-->
    <Tiptap {id} />
    <button on:click={saveNote}>Save Note</button>
  {/if}