import type { CourseEntry } from "$lib/types/CourseEntry.type";
import createCookiePersistentStore from "$lib/utils/createCookiePersistentStore";


const {
    store: SelectedEntriesStore, set: setSelectedEntries
} = createCookiePersistentStore<Set<CourseEntry["id"]>>({
    tokenName: "slotify-selected-entries",
    initialValue: new Set(),
    maxAgeSec: 60 * 60 * 24 * 30 * 5,
    encode: (data: Set<CourseEntry["id"]>): string => {
        return JSON.stringify(Array.from(data));
    },
    decode: (raw: string): Set<CourseEntry["id"]> => {
        if (!raw) return new Set();
        return new Set(JSON.parse(raw));
    }
});
export { SelectedEntriesStore, setSelectedEntries };