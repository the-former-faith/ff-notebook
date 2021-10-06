import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { createMachine, send } from 'xstate'
import { interpretInWebWorker } from '$lib/scripts/from-web-worker.js'

const ydoc = new Y.Doc()

const documentList = ydoc.getMap('doc-list')

const persistence = new IndexeddbPersistence('database', ydoc)

persistence.on('synced', (e) => { console.log(e) })

const createDoc = (context, event) => {
  console.log('Yes, sir!')
}

//Steps:
//1. Create documentList + add to context
//2. Create idbPeristeence + add to context


const pongMachine = createMachine({
  id: 'db',
  context: {
    ydoc: new Y.Doc(),
    documentList: undefined,
    idbPersistence: undefined
  },
  on: {
    CREATE: {
      actions: [createDoc],
    },
  },
})

const service = interpretInWebWorker(pongMachine);
service.start();