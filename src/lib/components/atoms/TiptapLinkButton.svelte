<script>
  import { DialogOverlay, DialogContent } from 'svelte-accessible-dialog'

  export let editor
  let isOpen
  let url = ''
  let previousUrl

  const open = () => {
    isOpen = true
  }

  const close = () => {
    isOpen = false
  }

  const setLink = (editor) => {
    previousUrl = editor.getAttributes('link').href
    url = previousUrl
    open()
    //const url = window.prompt('URL', previousUrl)
  }

  const saveChanges = (url, previousUrl) => {
    close()
    // cancelled
    if (url === previousUrl) {
      return
    }

    // empty
    if (url === '') {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .run()

      return
    }

    // update link
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }
</script>

<DialogOverlay {isOpen} onDismiss={close} style="z-index: 100;">
  <DialogContent aria-label="Set link" style="background-color: var(--background-color)">
    <input type="text" bind:value={url} />
    <div class="dialog-footer">
      <button on:click={close}>Cancel</button>
    <button on:click={()=> saveChanges(url, previousUrl)}>Save</button>
    </div>
  </DialogContent>
</DialogOverlay>

<button on:click={() => setLink(editor)} class:active={editor.isActive('link')}>
  link
</button>
{#if editor.isActive('link')}
<button on:click={() => editor.chain().focus().unsetLink().run()} >
  unsetLink
</button>
{/if}

<style>
  .dialog-footer {
    margin-top: 1rem;
    display: grid;
    gap: 1rem;
    grid-auto-flow: column;
  }
</style>