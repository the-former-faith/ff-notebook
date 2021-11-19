import { interpret } from 'xstate'
import { getEventType } from 'xstate/lib/utils'

export function fromWebWorker(createWorker) {
  return (context, event) => (sendBack, receive) => {
    const worker = createWorker(context, event);
    const handler = (event) => {

      try {

        // Will error out if the data is not a valid event
        getEventType(event.data)
        sendBack(event.data)

      } catch {}
    }

    worker.addEventListener('message', handler)

    receive(({ _transfer, ...event }) => {

      worker.postMessage(event, _transfer)

    })

    return () => {

      worker.removeEventListener('message', handler)

      worker.terminate()

    }
  }
}

export function interpretInWebWorker(machine, options) {

  const service = interpret(machine, {
    ...options,
    deferEvents: true,
    parent: {
      send: ({ _transfer, ...event }) => {
        self.postMessage(event, _transfer)
      },
    }
  });

  self.addEventListener('message', (event) => {
    try {
      // Will error out if the data is not a valid event
      getEventType(event.data)
      service.send(event.data)
    } catch {}
  });

  return service
}