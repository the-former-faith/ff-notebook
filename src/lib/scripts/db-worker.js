import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { createMachine, send } from 'xstate'
import { interpretInWebWorker } from '$lib/scripts/from-web-worker.js'
import { v1 as uuidv1 } from 'uuid'

const ydoc = new Y.Doc()

const documentList = ydoc.getMap('doc-list')

const idbPersistence = new IndexeddbPersistence('database', ydoc)

idbPersistence.on('synced', (e) => { console.log(e) })

//Could put this logic into the machine.
//Just have these sends events.
ydoc.on('subdocs', (e) => {
  console.log(e)
  e.added.forEach(subdoc => {
    subdoc.load()
  })

  e.loaded.forEach(subdoc => {
    const persistence = new IndexeddbPersistence(subdoc.guid, subdoc)
    //persistence.on('synced', ()=> myList = Object.entries(documentList.toJSON() ) )
  })
})

//documentList.observe( ( event => myList = Object.entries(documentList.toJSON() ) ) )


const createDoc = (context, event) => {
  const id = uuidv1()
  const newDoc = new Y.Doc()
  const fields = newDoc.getMap('fields')
  fields.set('title', `Doc ${Math.floor(Math.random() * 100)}`)
  const persistence = new IndexeddbPersistence(id, newDoc)
  
  documentList.set(id, newDoc)
}

//documentList.get(key).getMap('fields').toJSON().title


const pongMachine = createMachine({
  id: 'db',
  context: {
    ydoc: ydoc,
    documentList: documentList,
    idbPersistence: idbPersistence
  },
  on: {
    CREATE: {
      actions: [createDoc],
    },
  },
})

const service = interpretInWebWorker(pongMachine);
service.start();