import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { createMachine } from 'xstate'
import { interpretInWebWorker } from '$lib/scripts/from-web-worker.js'

const ydoc = new Y.Doc()

const documentList = ydoc.getMap('doc-list')

const idbPersistence = new IndexeddbPersistence('database', ydoc)

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
service.start()

//Could put this logic into the machine.
//Just have these sends events.
ydoc.on('subdocs', (e) => {
  //const test = Array.from(ydoc.subdocs).find( ({ guid }) => guid === '47aefa4a-48d5-4692-900c-35853fc5e4e7' )
  //test.load()

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
