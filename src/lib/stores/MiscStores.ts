import createCookiePersistentStore from "$lib/utils/createCookiePersistentStore";

const {
    store: TimeFormatStore, set: setTimeFormat
} = createCookiePersistentStore<TimeFormat>({
    tokenName: "slotify-time-format",
    initialValue: "12H",
    encode: (data: TimeFormat) => data as string,
    decode: (raw: string) => raw as TimeFormat,
});
export { TimeFormatStore, setTimeFormat };

const {
    store: ShowDisclaimer, set: setShowDisclaimer
} = createCookiePersistentStore<boolean>({
    tokenName: "slotify-disclaimer",
    initialValue: true,

    encode(data: boolean) {
        return data ? "true" : "false";
    },

    decode(raw: string) {
        if (raw === "true") {
            return true;
        }

        if (raw === "false") {
            return false;
        }

        throw new Error(`invalid boolean string: ${raw}`)
    }
});
export { ShowDisclaimer, setShowDisclaimer };