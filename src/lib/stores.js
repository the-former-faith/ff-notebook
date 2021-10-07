import { writable } from 'svelte/store'

export const mainService = writable(undefined)
export const online = writable(true)