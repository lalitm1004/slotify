import { browser } from "$app/environment";
import { writable, type Writable } from "svelte/store";
import getCookie from "$lib/utils/getCookie";

export interface PersistentStoreConfig<T> {
    tokenName: string;
    initialValue: T;
    maxAgeSec?: number;
    encode: (data: T) => string;
    decode: (raw: string) => T;
}

const createCookiePersistentStore = <T>({
    tokenName,
    initialValue,
    maxAgeSec = 60 * 60 * 24 * 365,
    encode,
    decode,
}: PersistentStoreConfig<T>): {
    store: Writable<T>;
    set: (data: T) => void;
} => {
    const getInitialData = (): T => {
        if (!browser) return initialValue;

        const cookieData = getCookie(document.cookie, tokenName);
        if (cookieData) {
            try {
                return decode(cookieData);
            } catch (e) {
                console.error(`Error decoding data for ${tokenName}: `, e);
            }
        }

        return initialValue;
    }

    const store = writable<T>(getInitialData());

    const setData = (data: T | null): void => {
        if (!browser) return;

        if (data !== null) {
            try {
                const encoded = encode(data);
                document.cookie = `${tokenName}=${encoded};path=/;max-age=${maxAgeSec};`;
            } catch (e) {
                console.error(`Error encoding data for ${tokenName}: `, e);
            }

            store.set(data);
        } else {
            document.cookie = `${tokenName}=null;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`
            store.set(initialValue);
        }
    }

    return {
        store,
        set: setData,
    }
}
export default createCookiePersistentStore;