<script>
  import { Editor, EditorContent } from 'svelte-tiptap';
  import Document from '@tiptap/extension-document'
  import Paragraph from '@tiptap/extension-paragraph'
  import Text from '@tiptap/extension-text'
  import Heading from '@tiptap/extension-heading'
  import Bold from '@tiptap/extension-bold'
  import Collaboration from '@tiptap/extension-collaboration'
  import Link from '@tiptap/extension-link'
  import findEntities from '$lib/scripts/findEntities'
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

  const marks = items[0]?.properties.content.items.properties.marks.items

  const createMarksArray = (marks, extensions) => {
    if(marks) {
      return marks.map(mark => extensions[mark.title])
    } else {
      return []
    }
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

    
    // editor.on('update', (e) => {
    //   const test = editor.state.doc.descendants((node) => {
    //     console.log(node)
    //   })
    //   console.log(test)
    // })
  }

  const addParagraphToEnd = () => {
    editor.commands.focus('end')
    const lastNode = editor.view.docView.children.at(-1)
    if (lastNode.node.textContent !== '') {
      editor.commands.insertContent('<p></p>')
    }
  }

  //TODO: add cleanup onDestroy

  const setMarks = (nlpResults, editor) => {
    nlpResults.forEach(x => {
      const existingMark = editor.state.doc.resolve(x.offset.start + (x.offset.length / 2)).marks()
      if (existingMark.length === 0) {
        editor
          .chain()
          .setTextSelection({from: x.offset.start + 1, to: x.offset.start + x.offset.length + 1})
          .setMark('bold')
          .run()
      }
    })
  }

  const runNlp = async (editor) => {
    const results = await findEntities( editor.getText({ blockSeparator: "\n\n" }) )
    setMarks(results.people, editor)
  }
  
</script>

{#if editor}
  <Toolbar {editor} {marks} />
{/if}
<div class="tiptap">
  <button type="button" 
    preventDefault={true} 
    on:click={()=> runNlp(editor)}
  >Find Entities</button>
  <button type="button" 
    preventDefault={true} 
    on:click={()=> setTimeout(() => {console.log(editor.state.selection)}, 1000)}
  >Log Editor</button>
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