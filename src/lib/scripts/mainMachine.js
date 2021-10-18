import { 
  createMachine, 
  assign, 
  interpret, 
  send, 
  spawn,
  forwardTo 
} from 'xstate'
//import DbWorker from '$lib/scripts/db-worker.js?worker'
//import { fromWebWorker } from '$lib/scripts/from-web-worker.js'
import { collections } from '$lib/scripts/stores'
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
      currentDoc: undefined,
      rxdb: null,
      collections: undefined
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
              rxdb: () => spawn(rxdbMachine, { sync: true })
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
                  (context, event)=>console.log(event),
                  assign({ 
                    collections: (context, event) => event.collections.posts
                  }),
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
                  forwardTo( (context, event) => context.rxdb ),
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

export const mainService = interpret(mainMachine)
  .onTransition((state) => {
    const { rxdb } = state.context
    //console.log( rxdb?.state.context.db?.posts?.find().$ )
    //console.log(collections)
    //collections.set(rxdb?.state.context.db?.posts?.find().$)
  })
  .start()
//export const mainService = interpret(mainMachine).start()
//export const { state, send } = useMachine(mainMachine)
