import { createMachine, interpret, assign, spawn } from 'xstate'
import editorMachine from '$lib/scripts/editorMachine'
import { browser } from '$app/env'

let initialOnlineStatus = 'online'

if (browser) {
  initialOnlineStatus = navigator.onLine ? 'online' : 'offline'
}

const mainMachine = createMachine({
  id: 'main machine',
  type: 'parallel',
  context: {
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

export const mainService = interpret(mainMachine).onTransition((state) => console.log(state)).start()

