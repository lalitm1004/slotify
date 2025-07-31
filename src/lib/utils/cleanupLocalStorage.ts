import { browser } from "$app/environment";
import { TIMETABLE_TOKEN } from "$lib/stores/TimetableStore";

const cleanupLocalStorage = () => {
    if (!browser) return;

    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);

        if (key && key !== TIMETABLE_TOKEN) {
            localStorage.removeItem(key);
        }
    }
}

export default cleanupLocalStorage;