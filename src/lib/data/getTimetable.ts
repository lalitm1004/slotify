import { browser } from "$app/environment";
import { DATA_VERSION } from "$lib/consts/data-version";
import { TimetableSchema, type Timetable } from "$lib/types/Timetable.type";
import computeSHA256Hex from "$lib/utils/computeSHA256Hex";


export const TIMETABLE_KEY = `slotify-timetable-${DATA_VERSION}`;
export const HASH_KEY = `slotify-hash-${DATA_VERSION}`;

const clearCache = () => {
    localStorage.removeItem(TIMETABLE_KEY);
    localStorage.removeItem(HASH_KEY);
};

const readFromCache = async (): Promise<Timetable | null> => {
    const storedTimetable = localStorage.getItem(TIMETABLE_KEY);
    const storedHash = localStorage.getItem(HASH_KEY);

    if (!storedTimetable || !storedHash) return null;

    try {
        const parsed = JSON.parse(storedTimetable);
        const result = await TimetableSchema.safeParseAsync(parsed);

        if (!result.success) {
            clearCache();
            console.error(
                "[slotify] TimetableSchema validation failed:",
                result.error.message
            );
            return null;
        }

        const computedHash = await computeSHA256Hex(result.data);

        if (computedHash !== storedHash) {
            clearCache();
            console.error(
                `[slotify] Hash mismatch: stored(${storedHash} != computed(${computedHash}))`
            );
            return null;
        }

        return result.data;
    } catch (e) {
        clearCache();
        console.error("[slotify] Timetable JSON parsing failed:", e);
        return null;
    }
};

const fetchFromApi = async (): Promise<Timetable | null> => {
    const response = await fetch("/api/timetable", { method: "GET" });
    if (!response.ok) return null;

    const { timetable, hash } = await response.json();

    localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable));
    localStorage.setItem(HASH_KEY, hash);

    return timetable as Timetable;
};

const getTimetable = async (): Promise<Timetable | null> => {
    if (!browser) return null;

    const cached = await readFromCache();
    if (cached) return cached;

    return fetchFromApi();
};
export default getTimetable;