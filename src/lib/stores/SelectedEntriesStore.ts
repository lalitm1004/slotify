import type { CourseEntry } from "$lib/types/CourseEntry.type";
import createCookiePersistentStore from "$lib/utils/createCookiePersistentStore";
import { get } from "svelte/store";


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

export const selectCourse = (id: CourseEntry["id"]): void => {
    const selected = get(SelectedEntriesStore);
    selected.add(id);
    setSelectedEntries(selected);
}

export const unselectCourse = (id: CourseEntry["id"]): void => {
    const selected = get(SelectedEntriesStore);
    selected.delete(id);
    if (selected.size === 0) {
        setSelectedEntries(null);
    } else {
        setSelectedEntries(selected);
    }
}

export const clearSelectedCourses = (): void => {
    setSelectedEntries(null)
}