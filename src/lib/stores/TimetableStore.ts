import { browser } from "$app/environment";
import { DATA_VERSION } from "$lib/consts/data-version";
import { TimetableSchema, type Timetable } from "$lib/types/Timetable.type";
import { writable } from "svelte/store";


export const TIMETABLE_TOKEN = `slotify-timetable-${DATA_VERSION}`;

const getInitialData = async (): Promise<Timetable | null> => {
    if (!browser) return null;

    const local = localStorage.getItem(TIMETABLE_TOKEN);

    if (local) {
        try {
            const result = await TimetableSchema.safeParseAsync(JSON.parse(local));

            if (result.success) {
                return result.data
            }
        } catch (e) {
            console.error("Error parsing Timetable from localstorage:", e);
            localStorage.removeItem(TIMETABLE_TOKEN);
        }
    }

    const response = await fetch("/api/course-entries", {
        method: "GET",
    });
    const data = await response.json();

    if (response.status === 200) {
        localStorage.setItem(TIMETABLE_TOKEN, JSON.stringify(data.timetable))
        return data.timetable as Timetable
    }

    return null;
}

export const TimetableStore = writable<Timetable | null>(await getInitialData());