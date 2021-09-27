import { writable } from 'svelte/store'

export const online = writable(false)
export const currentDoc = writable(undefined)