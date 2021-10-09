<script>
    import Tiptap from '$lib/Tiptap.svelte'

    export let id
  
  </script>
  
  <div id="editor-{id}">
    {#if id}
      <!--<input bind:value={$name} placeholder="Note Title" />-->
      <Tiptap {id} />
    {/if}
  </div>