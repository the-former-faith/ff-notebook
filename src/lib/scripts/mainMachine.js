import { createMachine, interpret, send } from 'xstate'
import DbWorker from '$lib/scripts/db-worker.js?worker'
import { fromWebWorker } from '$lib/scripts/from-web-worker.js'
import { browser } from '$app/env'
import rxdbMachine from '$lib/scripts/rxdb-machine'

//Set online state

let initialOnlineStatus = 'online'

if (browser) {
  initialOnlineStatus = navigator.onLine ? 'online' : 'offline'
}

const mainMachine = createMachine(
  {
    id: 'main machine',
    type: 'parallel',
    context: {
      db: undefined,
      currentDoc: undefined,
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
              src: rxdbMachine,
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
  },
  {
    // actions: {
    //   createDoc: (context, event) => {
    //     const newDoc = new Y.Doc()
    //     const fields = newDoc.getMap('fields')
    //     fields.set('title', '')
    //     fields.set('createdAt', Date.now() )
    //     fields.set('updatedAt', Date.now() )
    //     imageList.y.push(newDoc)
    //   }
    // }
  }
)

export const mainService = interpret(mainMachine).onTransition((state) => console.log(state)).start()
//export const mainService = interpret(mainMachine).start()
