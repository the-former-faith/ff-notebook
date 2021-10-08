import { createMachine, assign, interpret, send } from 'xstate'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Lang from '$lib/marks/lang'
import Link from '@tiptap/extension-link'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'

//const provider = 
//const awareness = provider.awareness

//Network provider could be it's own machine to reduce complexity in this macine.
//Then it would be able to manage it's own online state and errors.

const createEditor = (context, event) => {
  return new Editor({
    element: event.element,
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Lang,
      Link.configure({
        openOnClick: false,
      }),
      Collaboration.configure({
        document: context.ydoc,
        field: 'content',
      }),
      // CollaborationCursor.configure({
      //   provider: context.providerWS,
      //   user: {
      //     name: 'Cyndig Lauper',
      //     color: '#f783ac',
      //   },
      // }),
    ],
    // onUpdate() {
    //   const json = this.getJSON()
    //   body.set(json.content)
    // },
    // onTransaction: () => {
    //   // force re-render so `editor.isActive` works as expected
    //   context.editor = context.editor
    // },
  })
}

const createEditorMachine = ({id}) => {
  
  const editorMachine = createMachine({
    id: 'editorMachine',
    context: {
      id: id,
      ydoc: new Y.Doc(),
      editor: undefined,
      providerWS: undefined,
      providerIDB: undefined,
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
                providerWS: (context, event) =>  new WebsocketProvider('wss://ff-server.onrender.com', context.id, context.ydoc),
                providerIDB: (context, event) => new IndexeddbPersistence(context.id, context.ydoc)
              }),
              (context, event) => {
                if(context.networkStatus === 'offline') {
                  context.providerWS.disconnect()
                }
              },
              //send('CREATE_EDITOR')
            ],
            on: {
              'CREATE_EDITOR': { target: 'creatingEditor' }
            }
          },
          creatingEditor: {
            entry: [
              assign({
                editor: (context, event) =>  createEditor(context, event)
              }),
            ],
            on: {
              'DESTROY_EDITOR': { 
                actions: (context, event) => context.editor.destroy() 
              }
            }
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