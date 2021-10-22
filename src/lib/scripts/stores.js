import { writable } from 'svelte/store'

export const providerIDB = writable(undefined)
export const currentDoc = writable(undefined)
export const allDocsOpened = writable(false)