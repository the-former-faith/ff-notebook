<script>
  import { DialogOverlay, DialogContent } from 'svelte-accessible-dialog'
  import FormBuilder from '$lib/components/organisms/FormBuilder.svelte'

  export let editor
  export let title
  export let schema
  let data
  let isOpen

  const open = () => {
    isOpen = true
  }

  const close = () => {
    isOpen = false
  }

  const setLink = (editor) => {
    data = editor.getAttributes(title)
    open()
  }

  const saveChanges = (url, previousUrl) => {
    close()
    // cancelled
    // if (url === previousUrl) {
    //   return
    // }

    // // empty
    // if (url === '') {
    //   editor
    //     .chain()
    //     .focus()
    //     .extendMarkRange('link')
    //     .unsetLink()
    //     .run()

    //   return
    // }

    // // update link
    // editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }
</script>

<DialogOverlay {isOpen} onDismiss={close} class="overlay">
  <DialogContent aria-label="Set link" class="content">

    <!--@TODO: use formBuilder-->
    {#if data}
      <FormBuilder {schema} {data} />
    {/if}

    <div class="dialog-footer">
      <button on:click={close}>Cancel</button>
      <!--<button on:click={()=> saveChanges(url, previousUrl)}>Save</button>-->
    </div>
  </DialogContent>
</DialogOverlay>

<button type="button" on:click={() => setLink(editor)} class:active={editor.isActive(title)}>
  {title}
</button>

{#if editor.isActive('link')}

  <button on:click={() => editor.chain().focus().unsetLink().run()} >
    unset {title}
  </button>

{/if}

<style>
  .dialog-footer {
    margin: 1rem 0 0 auto;
    display: inline-grid;
    gap: 1rem;
    grid-auto-flow: column;
  }

  :global([data-svelte-dialog-overlay].overlay) {
    z-index: 100;
  }

  :global([data-svelte-dialog-content].content) {
    background-color: var(--background-color);
    width: calc(100% - 2rem);
    max-width: 800px;
  }

  :global([data-svelte-dialog-content] button) {
  }
</style>