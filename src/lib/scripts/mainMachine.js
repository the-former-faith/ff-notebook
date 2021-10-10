import { createMachine, interpret, send, assign } from 'xstate'
import DbWorker from '$lib/scripts/db-worker.js?worker'
import { fromWebWorker } from '$lib/scripts/from-web-worker.js'
import { browser } from '$app/env'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'

//Set online state

let initialOnlineStatus = 'online'

if (browser) {
  initialOnlineStatus = navigator.onLine ? 'online' : 'offline'
}

const createEditor = (doc) => {
  return new Editor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: doc,
        field: 'content',
      })
    ]
  })
}

const mainMachine = createMachine(
  {
    id: 'main machine',
    type: 'parallel',
    context: {
      docList: new Map(),
      currentID: undefined,
      currentIDProvider: undefined,
      ydoc: undefined
    },
    states: {
      connectionStatus: {
        initial: initialOnlineStatus,
        states: {
          online: {
            on: { TOGGLE: 'offline' }
          },
          offline: {
            on: { TOGGLE: 'online' }
          }
        }
      },
      user: {
        initial: 'loggedIn',
        states: {
          loggedIn: {
            on: {
              'CREATE': {
                actions: [send({ type: 'CREATE' }, { to: 'db' })],
              },
              'LOAD_DOC': {
                actions: [(context, event) => context.docList.set(event.data.id, {title: event.data.title})],
              },
              'SELECT_DOC': {
                actions: [
                  assign({ ydoc: new Y.Doc() }),
                  assign({ 
                    currentIDProvider: (context, event) =>  new IndexeddbPersistence(event.id, context.ydoc),
                    currentID: (context, event) => createEditor(context.ydoc)
                  })
                ],
              },
            },
          },
          loggedOut: {}
        }
      },
      in_browser: {
        initial: 'false',
        states: {
          true: {
            invoke: {
              id: 'db',
              src: fromWebWorker(() => new DbWorker() ),
            },
          },
          false: {
            on: {
              'BROWSER_LOADED': {target: 'true'}
            }
          }
        }
      }
    },
  }
)

export const mainService = interpret(mainMachine).onTransition((state) => console.log(state)).start()
//export const mainService = interpret(mainMachine).start()
