<script>
  import { Editor, EditorContent } from 'svelte-tiptap';
  import StarterKit from '@tiptap/starter-kit'
  import Collaboration from '@tiptap/extension-collaboration'
  import Link from '@tiptap/extension-link'
  import Toolbar from '$lib/components/molecules/TiptapToolbar.svelte'
  import ImageBlock from '$lib/components/molecules/TiptapImageBlock'
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'

  let editor
  let ydoc
  export let data

  $: if(data.id) {
    create()
  }

  const create = () => {
    if (editor) {
      editor.destroy()
    }
    ydoc = new Y.Doc()
    const providerIDB = new IndexeddbPersistence(data.id, ydoc)
    editor = new Editor({
      extensions: [
        StarterKit.configure({
          history: false,
        }),
        Collaboration.configure({
          document: ydoc,
          field: 'content',
        }),
        Link.configure({
          openOnClick: false,
        }),
        ImageBlock,
      ],
      onTransaction: (e) => {
        // force re-render so `editor.isActive` works as expected
        editor = editor
      },
    })
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
  <!--@TODO: see if I can get rid of this div now that I am
  using Svelte Tiptap-->
  <!--<div use:createTiptap={data.id} />-->
  <EditorContent editor={editor} />
  <button class="focus-filler" on:click={addParagraphToEnd}>
    <span class="screen-reader-text">Focus to end of doc</span>
  </button>
</div>

<style>

  .tiptap:empty {
    display: none;
  }

  .tiptap {
    outline: 1px solid var(--accent-color);
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
    outline-offset: -2px;
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