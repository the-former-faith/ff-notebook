import { createMachine, interpret } from 'xstate'
import { browser } from '$app/env'

let initialOnlineStatus = 'online'

if (browser) {
  initialOnlineStatus = navigator.onLine ? 'online' : 'offline'
}

const connectionStatusMachine = createMachine({
  id: 'connection-status',
  initial: initialOnlineStatus,
  states: {
    online: {
      on: { TOGGLE: 'offline' }
    },
    offline: {
      on: { TOGGLE: 'online' }
    }
  }
})

export const connectionStatusService = interpret(connectionStatusMachine).start()

