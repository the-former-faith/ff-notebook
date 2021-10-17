import { createMachine, assign, interpret } from 'xstate'
import { useMachine } from '@xstate/svelte'
//import DbWorker from '$lib/scripts/db-worker.js?worker'
//import { fromWebWorker } from '$lib/scripts/from-web-worker.js'
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
      collections: undefined,
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
            // on: {
            //   'CREATE': {
            //     actions: [send({ type: 'CREATE' }, { to: 'db' })],
            //   },
            // },
          },
          loggedOut: {}
        }
      },
      //@TODO: get rid of in_browser?
      //Can change it to something more top-level,
      //like 'interface_state'.
      //Then 'unmounted' and 'mounted' can be states.
      //So: change 'false' to 'unmounted'
      //and 'true' to 'mounted'
      in_browser: {
        initial: 'false',
        states: {
          true: {
            invoke: {
              id: 'db',
              src: rxdbMachine,
            },
            on: {
              'DB_LOADED': {
                actions: [
                  assign({ db: (context, event) => event.db })
                ]
              },
              'COLLECTIONS_LOADED': {
                target: 'idle',
                actions: [
                  (context, event)=> console.log(event),
                  assign({ collections: (context, event) => event.collections })
                ]
              },
            }
          },
          false: {
            on: {
              'BROWSER_LOADED': {target: 'true'}
            }
          },
          idle: {
            on: {
              'CREATE_DOC': {
                actions: [
                  (context, event)=> console.log(event)
                ]
              }
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

//export const mainService = interpret(mainMachine).onTransition((state) => console.log(state)).start()
export const mainService = interpret(mainMachine).start()
//export const { state, send } = useMachine(mainMachine)
