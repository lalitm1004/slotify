import createCookiePersistentStore from "$lib/utils/createCookiePersistentStore";

const DEVICE_TOKEN = 'slotify-device';
const {
    store: DeviceStore, set: setDevice
} = createCookiePersistentStore<Device>({
    tokenName: DEVICE_TOKEN,

    initialValue: 'desktop',

    encode: (d: Device) => {
        document.documentElement.dataset.device = d;
        return d as string;
    },

    decode: (s: string) => s as Device,
})
export { DEVICE_TOKEN, DeviceStore, setDevice };