import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { createMachine, sendParent, send } from 'xstate'
import { interpretInWebWorker } from '$lib/scripts/from-web-worker.js'
import { v1 as uuidv1 } from 'uuid'

const ydoc = new Y.Doc()

const documentList = ydoc.getMap('doc-list')

const idbPersistence = new IndexeddbPersistence('database', ydoc)

//idbPersistence.on('synced', (e) => { console.log(e) })

//documentList.observe( ( event => myList = Object.entries(documentList.toJSON() ) ) )


const createDoc = (context, event) => {
  const newDoc = new Y.Doc()
  const title = newDoc.getText('title')
  const docTitle = `Doc ${Math.floor(Math.random() * 100)}`
  title.insert(0, docTitle)
  
  documentList.set(newDoc.guid, newDoc)
}

//documentList.get(key).getMap('fields').toJSON().title


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
    persistence.on('synced', (e) => service.parent.send({type: 'NEWDOC', data: {
      id: subdoc.guid,
      title: documentList.get( subdoc.guid ).getText('title').toString() 
    }}))
  })

})
