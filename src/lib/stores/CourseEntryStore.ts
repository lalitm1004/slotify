import { browser } from "$app/environment";
import { CourseEntryListSchema, type CourseEntry } from "$lib/types/courseEntry.type";
import { ErrorStore } from "$lib/stores/MiscStores";
import { writable } from "svelte/store";
import { VERSION } from "$lib/consts/version";

const CACHE_KEY = `slotify-course-entries-${VERSION}`;
const EXPIRES_KEY = `${CACHE_KEY}-expires-at`;
const EXPIRATION_MS = 1000 * 60 * 60 * 24 * 30 * 3; // 3 months

const fetchCourseEntries = async (): Promise<CourseEntry[]> => {
    if (!browser) return [];

    const local = localStorage.getItem(CACHE_KEY);
    const expiresAt = localStorage.getItem(EXPIRES_KEY);

    const now = Date.now()

    if (local && expiresAt && now < parseInt(expiresAt)) {
        try {
            const parsed = CourseEntryListSchema.parse(JSON.parse(local));
            return parsed;
        } catch (error) {
            localStorage.removeItem(CACHE_KEY);
            localStorage.removeItem(EXPIRES_KEY);
        }
    }

    const response = await fetch("/api/course-entries", {
        method: "GET",
    });
    const data = await response.json();

    if (response.status === 200) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data.courses))
        localStorage.setItem(EXPIRES_KEY, (now + EXPIRATION_MS).toString())

        return data.courses as CourseEntry[]
    }

    ErrorStore.set(data.message as string)
    return []
}

export const CourseEntryStore = writable<CourseEntry[]>(await fetchCourseEntries());