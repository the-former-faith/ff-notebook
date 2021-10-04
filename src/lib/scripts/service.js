import { createMachine, interpret, assign, spawn } from 'xstate'
import editorMachine from '$lib/scripts/editorMachine'
import rxdbMachine from '$lib/scripts/rxdbMachine'
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
    db: undefined,
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
          // invoke: {
          //   src: rxdbMachine,
          //   autoForward: true
          // },
          on: {
            'NEW_EDITOR.ADD': {
              actions: assign({
                editors: (context, event) => [
                  ...context.editors,
                  {
                    ref: spawn(editorMachine(event.doc), event.id)
                  }
                ]
              })
            }
          }
        },
        loggedOut: {}
      }
    }
  }
})

//export const mainService = interpret(mainMachine).onTransition((state) => console.log(state.children)).start()
export const mainService = interpret(mainMachine).start()
