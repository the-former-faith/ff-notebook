import { createMachine, interpret, assign, spawn, send } from 'xstate'
import editorMachine from '$lib/scripts/editorMachine'
import DbWorker from '$lib/scripts/db-worker.js?worker'
import { fromWebWorker } from '$lib/scripts/from-web-worker.js'
import { browser } from '$app/env'

//Set online state

let initialOnlineStatus = 'online'

if (browser) {
  initialOnlineStatus = navigator.onLine ? 'online' : 'offline'
}

const mainMachine = createMachine({
  id: 'main machine',
  type: 'parallel',
  context: {
    docList: new Map(),
    editors: []
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
            'NEW_EDITOR.ADD': {
              actions: [
                //(context, event)=> console.log(event.id),
                assign({
                  editors: (context, event) => [
                    ...context.editors,
                    {
                      ref: spawn(editorMachine({id: event.id, doc: event.doc}), event.id)
                    }
                  ]
                })
              ]
            }
          },
        },
        loggedOut: {}
      }
    },
    environment: {
      initial: 'idle',
      states: {
        browser: {
          invoke: {
            id: 'db',
            src: fromWebWorker(() => new DbWorker() ),
          },
        },
        idle: {}
      }
    }
  }
})

//export const mainService = interpret(mainMachine).onTransition((state) => console.log(state.children)).start()
export const mainService = interpret(mainMachine).start()
