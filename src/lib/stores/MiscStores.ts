import { writable } from "svelte/store";

export const ErrorStore = writable<string | null>(null);