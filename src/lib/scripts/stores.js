import { writable } from 'svelte/store'

export const currentDoc = writable(undefined)
export const allDocsOpened = writable(false)