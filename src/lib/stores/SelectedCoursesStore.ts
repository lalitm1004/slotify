import { VERSION } from "$lib/consts/version";
import type { CourseEntry } from "$lib/types/courseEntry.type";
import createCookiePersistentStore from "$lib/utils/createCookiePersistentStore";
import { get } from "svelte/store";

const SAVED_COURSES_TOKEN = `slotify-saved-course-entries-${VERSION}`;
const {
    store: SelectedCoursesStore, set: setSelectedCourses
} = createCookiePersistentStore<CourseEntry["id"][]>({
    tokenName: SAVED_COURSES_TOKEN,

    initialValue: [],

    maxAgeSec: 60 * 60 * 24 * 30 * 3, // 3 months

    encode(data) {
        return JSON.stringify(data);
    },

    decode(raw) {
        return JSON.parse(raw);
    }
});

const selectCourse = (id: CourseEntry["id"]) => {
    const selected = get(SelectedCoursesStore) ?? [];
    if (!selected?.includes(id)) {
        setSelectedCourses([...selected, id]);
    }
}

const unselectCourse = (id: CourseEntry["id"]) => {
    const selected = get(SelectedCoursesStore) ?? [];
    setSelectedCourses(selected.filter((cId) => cId !== id));
}

const clearSelectedCourses = () => {
    setSelectedCourses([]);
}

export { SelectedCoursesStore, setSelectedCourses, selectCourse, unselectCourse, clearSelectedCourses };