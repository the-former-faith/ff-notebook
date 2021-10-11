import { writable } from 'svelte/store'

export const currentID = writable(undefined)
export const currentDoc = writable({
  providerIDB: undefined,
})

export const allDocsOpened = writable(false)