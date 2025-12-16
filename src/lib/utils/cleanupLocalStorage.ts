import { browser } from "$app/environment"
import { HASH_KEY, TIMETABLE_KEY } from "$lib/data/getTimetable";

const WHITELISTED_KEYS = new Set([
    TIMETABLE_KEY,
    HASH_KEY,
]);

const cleanupLocalStorage = () => {
    if (!browser) return;

    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);

        if (key && !WHITELISTED_KEYS.has(key)) {
            localStorage.removeItem(key);
        }
    }
}
export default cleanupLocalStorage;