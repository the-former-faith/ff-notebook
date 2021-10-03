import { writable } from 'svelte/store'

let dbPromise

const pushQueryBuilder = doc => {
  const query = `
    mutation($doc: [AddDocInput!]!) {
      addDoc(input: $doc, upsert: true) {
        doc {
          id
          name
          deleted
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
  
  const fixedDoc = (doc) => {
    const clone = (({ _attachments, _rev, _deleted, ...o }) => o)(doc) 
    clone.deleted = doc._deleted
    //This only seems to be a problem on deleted docs,
    //So I could move this to set on delete, instead.
    clone.updatedAt = new Date().getTime()
    return clone
  }

  const variables = {
    doc: fixedDoc(doc)
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
      deleted
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


/**
 * Svelte Writables ============================================================
 */

export const noteList = writable([])
export const name = writable('')
export const body = writable(undefined)
export const online = writable(true)
export const currentDoc = writable(undefined)