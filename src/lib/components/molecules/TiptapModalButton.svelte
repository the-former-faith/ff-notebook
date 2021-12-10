<script>
  import { DialogOverlay, DialogContent } from 'svelte-accessible-dialog'
  import FormBuilder from '$lib/components/organisms/FormBuilder.svelte'
  import Autocomplete from '$lib/components/atoms/Autocomplete.svelte'

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

  const openModal = (editor) => {
    data = editor.getAttributes(title)
    open()
  }

  const handleChange = (value, path, editor) => {
    let patch = {}
    patch[path] = value
    editor
      .chain()
      .extendMarkRange(title)
      .setMark(title, patch)
      .run()
  }
</script>

<DialogOverlay {isOpen} onDismiss={close} class="overlay">
  <DialogContent aria-label="Set {title}" class="content">

    {#if data}
      <FormBuilder 
        schema={schema.properties} 
        {data} 
        customFields={{autocomplete: Autocomplete}}
        changeHandler={(value, path) => handleChange(value, path, editor)}
      />
    {/if}

    <div class="dialog-footer">
      <button on:click={close}>Close</button>
    </div>
  </DialogContent>
</DialogOverlay>

<!--@TODO: select full word-->
<button type="button" on:click={() => openModal(editor)} class:active={editor.isActive(title)}>
  {title}
</button>

{#if editor.isActive(title)}

  <button on:click={() => editor.chain().focus().extendMarkRange(title).unsetMark(title).run()} >
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