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

export const DEVICE_TOKEN = "slotify-device";
const {
    store: DeviceStore, set: setDevice
} = createCookiePersistentStore<Device>({
    tokenName: DEVICE_TOKEN,
    initialValue: 'desktop',
    encode: (data: Device) => {
        document.documentElement.dataset.device = data;
        return data as string;
    },
    decode: (raw: string) => raw as Device,
});
export { DeviceStore, setDevice };