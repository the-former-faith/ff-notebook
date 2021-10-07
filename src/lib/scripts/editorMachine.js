import { createMachine, assign, interpret, send } from 'xstate'
import * as Y from 'yjs'
import * as ywebsocket from 'y-websocket'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Lang from '$lib/marks/lang'
import Link from '@tiptap/extension-link'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'

//const provider = 
//const awareness = provider.awareness

const createEditor = (context, event) => {
  return new Editor({
    element: element,
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Lang,
      Link.configure({
        openOnClick: false,
      }),
      Collaboration.configure({
        document: ydoc,
        field: 'content',
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: 'Cyndig Lauper',
          color: '#f783ac',
        },
      }),
    ],
    onUpdate() {
      const json = this.getJSON()
      body.set(json.content)
    },
    onTransaction: () => {
      // force re-render so `editor.isActive` works as expected
      editor = editor
    },
  })
}

//Network provider could be it's own machine to reduce complexity in this macine.
//Then it would be able to manage it's own online state and errors.

const createEditorMachine = ({id, doc}) => {
  
  const editorMachine = createMachine({
    id: 'editorMachine',
    context: {
      id: id,
      doc: doc,
      ydoc: new Y.Doc(),
      editor: undefined,
      provider: undefined,
      networkStatus: 'offline'
    },
    type: 'parallel',
    states: {
      editor: {
        initial: 'initiatingProvider',
        states: {
          initiatingProvider: {
            entry: [
              assign({
                provider: (context, event) =>  new ywebsocket.WebsocketProvider('wss://ff-server.onrender.com', context.id, context.ydoc)
              }),
              (context, event) => {
                if(context.networkStatus === 'offline') {
                  context.provider.disconnect()
                }
              }
            ],
            on: {
              'CREATE_EDITOR': { target: 'creatingEditor' }
            }
          },
          creatingEditor: {
            actions: (context, event) => console.log(context)
          }
        },
      },
      userInput: {
        initial: 'idle',
        states: {
          idle: {}
        }
      }
    }
  })

  const service = interpret(editorMachine).start()

  service.onTransition((state) => {
    requestAnimationFrame(() => service.execute(state));
  });

  return service
}

export default createEditorMachine