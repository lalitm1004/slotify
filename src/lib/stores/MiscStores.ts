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