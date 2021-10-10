import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { createMachine } from 'xstate'
import { interpretInWebWorker } from '$lib/scripts/from-web-worker.js'

const ydoc = new Y.Doc()

const documentList = ydoc.getMap('doc-list')

const idbPersistence = new IndexeddbPersistence('database', ydoc)

//documentList.observe( ( event => myList = Object.entries(documentList.toJSON() ) ) )


const createDoc = (context, event) => {
  const newDoc = new Y.Doc()
  const fields = newDoc.getMap('fields')
  fields.set('title', '')
  fields.set('createdAt', Date.now() )
  fields.set('updatedAt', Date.now() )
  documentList.set(newDoc.guid, newDoc)
}

const dbMachine = createMachine({
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

const service = interpretInWebWorker(dbMachine)
service.start();

//Could put this logic into the machine.
//Just have these sends events.
ydoc.on('subdocs', (e) => {
  e.added.forEach(subdoc => {
    subdoc.load()
  })

  e.loaded.forEach(subdoc => {
    const persistence = new IndexeddbPersistence(subdoc.guid, subdoc)
    persistence.on('synced', (e) => {
      service.parent.send({type: 'LOAD_DOC', data: {
      id: subdoc.guid,
      fields: documentList.get( subdoc.guid ).getMap('fields').toJSON()
    }})})
  })

})
