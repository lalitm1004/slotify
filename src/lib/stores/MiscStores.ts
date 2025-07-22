import createCookiePersistentStore from "$lib/utils/createCookiePersistentStore";
import { writable } from "svelte/store";

export const ErrorStore = writable<string | null>(null);

const {
    store: Use12HFormat, set: setFormatTo12H
} = createCookiePersistentStore<boolean>({
    tokenName: "slotify-use-12h-format",

    initialValue: true,

    encode(data) {
        return data ? '1' : '0';
    },

    decode(raw) {
        if (raw === "0") return false;
        return true;
    },
});
export { Use12HFormat, setFormatTo12H };