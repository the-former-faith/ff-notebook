<script>
  import { Editor, EditorContent } from 'svelte-tiptap';
  import Document from '@tiptap/extension-document'
  import Paragraph from '@tiptap/extension-paragraph'
  import Text from '@tiptap/extension-text'
  import Heading from '@tiptap/extension-heading'
  import Bold from '@tiptap/extension-bold'
  import Collaboration from '@tiptap/extension-collaboration'
  import Link from '@tiptap/extension-link'
  
  import Toolbar from '$lib/components/molecules/TiptapToolbar.svelte'
  import ImageBlock from '$lib/components/molecules/TiptapImageBlock'
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'

  let editor
  let ydoc
  export let data
  export let items

  //@TODO: set up nodes and marks as objects to be selected from.
  //Dynamically load nodes and marks in Tiptap based on schema
  const extensions = {
    link: Link.configure({
      openOnClick: false,
    }),
    bold: Bold
  }

  const marks = items[0].properties.content.items.properties.marks.items

  const createMarksArray = (marks, extensions) => {
    return marks.map(mark => {
      return extensions[mark.title]
    })
  }

  $: if(data.id) {
    create()
  }

  const create = () => {
    if (editor) {
      editor.destroy()
      //TODO: destroy doc and provider
    }
    ydoc = new Y.Doc()
    const providerIDB = new IndexeddbPersistence(data.id, ydoc)
    editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Heading.configure({
          //I can set this dynamically based on allowed values in the schema.
          //But it can also have a default.
          levels: [2, 3, 4, 5, 6],
        }),
        ImageBlock,
        //@TODO: load nodes based on schema.
        //@TODO: dynamically load toolbar buttons.
        //@TODO: Make creation of custom extensions dynamic?
        //@TODO: Dynamically load attribute modals with formbuilder.
        //?? Use a div with role instead of paragraph?
        Collaboration.configure({
          document: ydoc,
          field: 'content',
        }),
        ...createMarksArray(marks, extensions)
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

  //TODO: add cleanup onDestroy
  
</script>

{#if editor}
  <Toolbar {editor} />
{/if}
<div class="tiptap">
  <EditorContent editor={editor} />
  <button class="focus-filler" on:click={addParagraphToEnd}>
    <span class="screen-reader-text">Focus to end of doc</span>
  </button>
  <button type="button" preventDefault={true} on:click={()=> console.log(editor.getJSON())}>Log Editor</button>
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