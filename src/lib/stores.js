import { writable } from 'svelte/store'
import { createRxDatabase, addRxPlugin } from 'rxdb/plugins/core'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { addPouchPlugin, getRxStoragePouch } from 'rxdb/plugins/pouchdb'
import { RxDBReplicationGraphQLPlugin } from 'rxdb/plugins/replication-graphql'
import * as idb from 'pouchdb-adapter-idb'

import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBValidatePlugin } from 'rxdb/plugins/validate'
import noteSchema from '$lib/schema'

/**
 * RxDB ========================================================================
 */

addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBValidatePlugin)
addRxPlugin(RxDBUpdatePlugin)
addRxPlugin(RxDBReplicationGraphQLPlugin)
addPouchPlugin(idb)

let dbPromise

const pushQueryBuilder = doc => {
  console.log(doc)
  const query = `
    mutation($doc: [AddDocInput!]!) {
      addDoc(input: $doc, upsert: true) {
        doc {
          id
          name
          _deleted
          createdAt
          updatedAt
          body {
            content {
              items {
                marks {
                  type
                }
                text
                type
              }
            }
            type
          }
        }
      }
    }
  `;
  const variables = {
    doc: doc
  };
  return {
      query,
      variables
  };
};

const pullQueryBuilder = doc => {

  if (!doc) {
    // the first pull does not have a start-document
    doc = {
      id: '',
      updatedAt: 0
    }
  }

  const query = `{
    queryDoc(filter: {updatedAt: {gt: ${doc.updatedAt}}}, order: {desc: updatedAt}) {
      id
      name
      _deleted
      createdAt
      updatedAt
      body {
        content {
          items {
            marks {
              type
            }
            text
            type
          }
        }
        type
      }
    }
  }`

  return {
    query,
    variables: {}
  }
}

const _create = async () => {
  const db = await createRxDatabase({
    name: 'rxdbdemo',
    storage: getRxStoragePouch('idb'),
    ignoreDuplicate: true
  });
  await db.addCollections({ notes: { schema: noteSchema } })

  const delteUnusedFields = (doc) => {
    delete doc._attachments
    delete doc._rev
  }

  //Sync GraphQL
  const replicationState = db.notes.syncGraphQL({
    url: 'https://blue-surf-410066.us-east-1.aws.cloud.dgraph.io/graphql', // url to the GraphQL endpoint
    pull: {
        queryBuilder: pullQueryBuilder, // the queryBuilder from above
        modifier: doc => doc // (optional) modifies all pulled documents before they are handeled by RxDB. Returning null will skip the document.
    },
    push: {
      queryBuilder: pushQueryBuilder, // the queryBuilder from above
      batchSize: 5, // (optional) amount of documents that will be send in one batch
      modifier: doc => delteUnusedFields(doc) // (optional) modifies all pushed documents before they are send to the GraphQL endpoint. Returning null will skip the document.
    },
    deletedFlag: '_deleted', // the flag which indicates if a pulled document is deleted
    live: true // if this is true, rxdb will watch for ongoing changes and sync them, when false, a one-time-replication will be done
  })

  replicationState.error$.subscribe(err => {
    console.error('replication error:');
    console.dir(err);
  })

  replicationState.send$.subscribe(d => {
    console.log(d);
  })

  dbPromise = db;
  return db;
};

export const db = () => dbPromise ? dbPromise : _create();


/**
 * Svelte Writables ============================================================
 */

export const noteList = writable([])
export const name = writable('')
export const body = writable('')
export const online = writable(false)
export const currentDoc = writable(undefined)