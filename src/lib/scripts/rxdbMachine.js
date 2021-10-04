import { createMachine, assign } from 'xstate'
import { createRxDatabase, addRxPlugin } from 'rxdb/plugins/core'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb'
import { RxDBReplicationGraphQLPlugin } from 'rxdb/plugins/replication-graphql'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBValidatePlugin } from 'rxdb/plugins/validate'
import * as idb from 'pouchdb-adapter-idb'


import noteSchema from '$lib/schema'

//Add plugins
addPouchPlugin(idb)
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBValidatePlugin)
addRxPlugin(RxDBUpdatePlugin)
addRxPlugin(RxDBReplicationGraphQLPlugin)

const test = () => {
  console.log('test')
}

const rxdbMachine = () => {

  return createMachine({
    id: 'rxdb machine',
    type: 'parallel',
    context: {
      db: undefined,
      docsList: undefined,
      error: undefined
    },
    states: {
      dbStatus: {
        initial: 'initiating',
        states: {
          initiating: {
            invoke: {
              id: 'initiateDb',
              src: () => createRxDatabase({
                name: 'rxdbdemo',
                storage: getRxStoragePouch('idb'),
                ignoreDuplicate: true
              }),
              onDone: {
                target: 'initiated',
                //target: 'addCollection',
                actions: assign({ db: (context, event) => event.data })
              },
              onError: {
                target: 'failure',
                actions: assign({ error: (context, event) => event.data })
              }
            }
          },
          // addCollection: {
          //   invoke: {
          //     id: 'addCollection',
          //     src: (context, event) => context.db.addCollections({ notes: { schema: noteSchema } }),
          //     onDone: {
          //       target: 'initiated',
          //     },
          //     onError: {
          //       target: 'failure',
          //       actions: assign({ error: (context, event) => event.data })
          //     }
          //   }
          // },
          failure: {},
          initiated: {
            actions: [test]
          }
        }
      },
    }
  })
}

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