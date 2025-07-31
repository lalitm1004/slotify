import { DATA_VERSION } from "$lib/consts/data-version";
import type { CourseEntry } from "$lib/types/CourseEntry.type";
import createCookiePersistentStore from "$lib/utils/createCookiePersistentStore";
import { get } from "svelte/store";


export const SELECTED_ENTRIES_TOKEN = `slotify-selected-entries-${DATA_VERSION}`;
const {
    store: SelectedEntriesStore, set: setSelectedEntries
} = createCookiePersistentStore<Set<CourseEntry["id"]>>({
    tokenName: SELECTED_ENTRIES_TOKEN,
    initialValue: new Set(),
    maxAgeSec: 60 * 60 * 24 * 30 * 5,
    encode(data) {
        return Array.from(data).join("|")
    },
    decode(raw) {
        if (raw === "") return new Set();
        return new Set(raw.split('|'));
    },
});

export const selectCourse = (id: CourseEntry["id"]) => {
    const selected = get(SelectedEntriesStore) ?? new Set();
    selected.add(id)
    setSelectedEntries(selected);
}

export const unselectCourse = (id: CourseEntry["id"]) => {
    const selected = get(SelectedEntriesStore) ?? new Set();
    selected.delete(id);
    setSelectedEntries(selected);
}

export const clearSelectedCourses = () => {
    setSelectedEntries(new Set());
}

export { SelectedEntriesStore, setSelectedEntries };