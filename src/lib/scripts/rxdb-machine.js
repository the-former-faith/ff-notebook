import { createMachine, assign, sendParent } from 'xstate'
import { createRxDatabase, addRxPlugin } from 'rxdb/plugins/core'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb'
import * as idb from 'pouchdb-adapter-idb'

import noteSchema from '$lib/schema'

//Add plugins
addRxPlugin(RxDBUpdatePlugin)
addPouchPlugin(idb)

const rxdbMachine = createMachine({
    id: 'rxdb',
    initial: 'initiating',
    context: {
      db: undefined,
      collections: undefined,
      error: undefined
    },
    states: {
      initiating: {
        entry: ()=> console.log('hello world'),
        invoke: {
          id: 'initiateDb',
          src: () => createRxDatabase({
            name: 'rxdbdemo',
            storage: getRxStoragePouch('idb'),
            ignoreDuplicate: true
          }),
          onDone: {
            target: 'addingCollections',
            actions: [
              ()=> console.log('child say db loaded'),
              assign({ db: (context, event) => event.data }),
              sendParent((context, event) => ({type: 'DB_LOADED', db: event.data}))
            ]
          },
          onError: {
            target: 'failure',
            actions: assign({ error: (context, event) => event.data })
          }
        }
      },
      addingCollections: {
        invoke: {
          id: 'addCollection',
          src: (context, event) => Promise.all([
            context.db.addCollections({ posts: { schema: noteSchema } }),
            context.db.addCollections({ images: { schema: noteSchema } })
          ]),
          onDone: {
            target: 'idle',
            actions: [
              ()=> console.log('child say collections added'),
              assign({ collections: (context, event) => event.data }),
              sendParent((context, event) => ({type: 'COLLECTIONS_LOADED', collections: Object.assign({}, ...event.data)}))
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
        entry: ()=> console.log('child say idle'),
        on: {
          // '*': {actions: [
          //   ()=> console.log('child received event'),
          // ]},
          'CREATE': {
            actions: [
              ()=> console.log('child received event'),
              (context, event)=> console.log('event: ',event)
            ]
          }
        }
      }
    }
  },
  {
    actions: {
      //test: (context, event) => console.log(context)
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