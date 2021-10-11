<script>
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import Collaboration from '@tiptap/extension-collaboration'
  import Link from '@tiptap/extension-link'
  import Toolbar from '$lib/Toolbar.svelte'

  let editor
  export let ydoc

  //let loadedEditor = 'empty'

  const createTiptap = (node, doc) => {
    const create = (node, doc) => {
      editor = new Editor({
        element: node,
        extensions: [
          StarterKit.configure({
            history: false,
          }),
          Collaboration.configure({
            document: doc,
            field: 'content',
          }),
          Link
        ],
        onTransaction: (e) => {
          // force re-render so `editor.isActive` works as expected
          editor = editor
        },
      })
    }

    create(node, doc)

    return {
      update(newDoc) {
        if(editor) {
          editor.destroy()
        }
    
        create(node, newDoc)
      },
      destroy() {
        if(editor) {
          editor.destroy()
        }
      }
    };
  }
  
</script>
  {#if editor}
    <Toolbar {editor} />
  {/if}
  <div use:createTiptap={ydoc} class="tiptap" />
<style>

  .tiptap:empty {
    display: none;
  }

  .tiptap :global(.ProseMirror) {
    border: 1px solid var(--accent-color);
    padding: 0.5rem;
  }

  .tiptap :global(* + *) {
    margin-top: 0.5rem;
  }

  /* .tiptap:focus-within {
    outline: 2px solid var(--action-color);
  } */
</style>
