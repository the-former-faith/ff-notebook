<script>
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import Collaboration from '@tiptap/extension-collaboration'
  import Link from '@tiptap/extension-link'
  import Toolbar from '$lib/components/molecules/TiptapToolbar.svelte'

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
          Link.configure({
            openOnClick: false,
          })
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

  const addParagraphToEnd = () => {
    editor.commands.focus('end')
    const lastNode = editor.view.docView.children.at(-1)
    if (lastNode.node.textContent !== '') {
      editor.commands.insertContent('<p></p>')
    }
  }
  
</script>
  {#if editor}
    <Toolbar {editor} />
  {/if}
  <div class="tiptap">
    <div use:createTiptap={ydoc} />
    <button class="focus-filler" on:click={addParagraphToEnd}>
      <span class="screen-reader-text">Focus to end of doc</span>
    </button>
  </div>
<style>

  .tiptap:empty {
    display: none;
  }

  .tiptap {
    border: 1px solid var(--accent-color);
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  .tiptap :global(* + *) {
    margin-top: 0.5rem;
  }

  .tiptap :global([contenteditable="true"]) {
    outline: 0;
  }

  .tiptap:focus-within {
    outline: 2px solid var(--action-color);
  }

  .focus-filler {
    flex: 1;
    outline: 0;
    background-color: transparent;
    min-height: initial;
    padding: 0;
    margin: 0;
  }
</style>
