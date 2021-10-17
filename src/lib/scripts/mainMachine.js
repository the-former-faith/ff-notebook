import { createMachine, assign, interpret, send, spawn } from 'xstate'
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
      rxdb: null
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
            entry: assign({
              rxdb: () => spawn(rxdbMachine)
            }),
            on: {
              'DB_LOADED': {
                actions: [
                  ()=>console.log('db loaded'),
                  assign({ db: (context, event) => event.db })
                ]
              },
              'COLLECTIONS_LOADED': {
                target: 'idle',
                actions: [
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
            //entry: console.log('parent idle'),
            on: {
              'CREATE_DOC': {
                actions: [
                  (context, event)=> console.log('parent received event'),
                  send('CREATE', {to: (context, event) => context.rxdb}),
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
