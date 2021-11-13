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
    editor.commands.focus()
  }

  const setLink = (editor) => {
    data = editor.getAttributes(title)
    open()
  }

  const handleChange = (e, editor) => {
    let patch = {}
    patch[e.target.name] = e.target.value
    editor
      .chain()
      .extendMarkRange('link') //@TODO: remove all named 'link'
      .setLink(patch)
      .run()
  }
</script>

<DialogOverlay {isOpen} onDismiss={close} class="overlay">
  <DialogContent aria-label="Set link" class="content">

    {#if data}
      <FormBuilder 
        {schema} 
        {data} 
        changeHandler={(e) => handleChange(e, editor)}
      />
    {/if}

    <div class="dialog-footer">
      <button on:click={close}>Close</button>
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