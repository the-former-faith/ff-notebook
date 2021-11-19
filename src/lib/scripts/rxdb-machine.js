import { createMachine, assign, sendParent } from 'xstate'
// import { createRxDatabase, addRxPlugin } from 'rxdb'
// import * as RxDBUpdatePlugin from 'rxdb/dist/lib/plugins/update.js'
// import { RxDBQueryBuilderPlugin } from 'rxdb/dist/lib/plugins/query-builder/index.js'
// import { getRxStoragePouch, addPouchPlugin } from 'rxdb/dist/lib/plugins/pouchdb/index.js'
//import * as RxDBValidatePlugin from 'rxdb/dist/lib/plugins/validate.js'
// import { RxDBMigrationPlugin } from 'rxdb/dist/lib/plugins/migration/index.js'
// import * as idb from 'pouchdb-adapter-idb'
//import { v1 as uuidv1 } from 'uuid'

import { schemas } from '$lib/scripts/schema'

//Add plugins
//addRxPlugin(RxDBUpdatePlugin)
//addRxPlugin(RxDBQueryBuilderPlugin)
//addRxPlugin(RxDBValidatePlugin)
//addRxPlugin(RxDBMigrationPlugin)
//addPouchPlugin(idb)

const rxdbMachine = createMachine({
    id: 'rxdb',
    initial: 'initiating',
    context: {
      db: undefined,
      collections: undefined,
      error: undefined,
      schemas: schemas
    },
    states: {
      initiating: {
        // invoke: {
        //   id: 'initiateDb',
        //   src: () => createRxDatabase({
        //     name: 'rxdbdemo',
        //     storage: getRxStoragePouch('idb'),
        //     ignoreDuplicate: true
        //   }),
        //   onDone: {
        //     target: 'addingCollections',
        //     actions: [
        //       assign({ db: (context, event) => event.data }),
        //     ]
        //   },
        //   onError: {
        //     target: 'failure',
        //     actions: [
        //       (context, event) => console.log(event.data),
        //       assign({ error: (context, event) => event.data })
        //     ]
        //   }
        // }
      },
      addingCollections: {
        invoke: {
          id: 'addCollection',
          src: (context, event) => context.db.addCollections(context.schemas),
          onDone: {
            target: 'idle',
            actions: [
              assign({
                collections: (context, event) => {
                  let observers = []
                  for (const [key, value] of Object.entries(event.data)) {
                    const o = value
                      .find()
                      .sort({ updatedAt: 'desc' })
                      .$
                    observers[key] = o
                  }

                  return observers
                }
              })
            ]
          },
          onError: {
            target: 'failure',
            actions: [
              (context, event) => console.log(event.data),
              assign({ error: (context, event) => event.data })
            ]
          }
        }
      },
      failure: {},
      'idle': {
        entry: sendParent((context, event) => ({type: 'COLLECTIONS_LOADED', collections: event.data}) ),
        on: {
          'CREATE_DOC': {
            actions: [
              'createDoc'
            ]
          }
        }
      }
    }
  },
  {
    actions: {
      createDoc: async (context, event) => {
        const blankDoc = {
          id: 'test',//uuidv1(),
          title: '',
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        }
        const newDoc = await context.db[event.collection].insert(blankDoc)
        // $currentDoc = newDoc
        // goto(`/${newDoc.id}`)
        // $allDocsOpened = false
      }
    }
  })

export default rxdbMachine

//Sync GraphQL
//TODO - Only turn on replication when online.

//And cancel replication if network is lost.
// const replicationState = db.notes.syncGraphQL({
//   url: 'https://blue-surf-410066.us-east-1.aws.cloud.dgraph.io/graphql', // url to the GraphQL endpoint
//   pull: {
//       queryBuilder: pullQueryBuilder, // the queryBuilder from above
//       modifier: doc => doc // (optional) modifies all pulled documents before they are handeled by RxDB. Returning null will skip the document.
//   },
//   push: {
//     queryBuilder: pushQueryBuilder, // the queryBuilder from above
//     batchSize: 5, // (optional) amount of documents that will be send in one batch
//     modifier: doc => doc // (optional) modifies all pushed documents before they are send to the GraphQL endpoint. Returning null will skip the document.
//   },
//   deletedFlag: 'deleted', // the flag which indicates if a pulled document is deleted
//   live: true // if this is true, rxdb will watch for ongoing changes and sync them, when false, a one-time-replication will be done
// })

// replicationState.error$.subscribe(err => {
//   console.error('replication error:');
//   console.dir(err);
// })

// replicationState.send$.subscribe(d => {
//   console.log("Sent: ", d);
// })

// replicationState.received$.subscribe(d => {
//   console.log("Received: ", d);
// })