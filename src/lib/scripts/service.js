import { createMachine, interpret } from 'xstate'
import { browser } from '$app/env'

let initialOnlineStatus = 'online'

if (browser) {
  initialOnlineStatus = navigator.onLine ? 'online' : 'offline'
}

const mainMachine = createMachine({
  id: 'main machine',
  type: 'parallel',
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
    docEditors: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            'NEW_EDITOR.ADD': {
              actions: ()=> console.log('hello world')
            }
            // ...
          }
        }
      }
    }
  }
})

export const mainService = interpret(mainMachine).start()

