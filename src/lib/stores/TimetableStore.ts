import { derived, readable, type Readable } from "svelte/store";
import getTimetable from "$lib/data/getTimetable";
import type { Timetable } from "$lib/types/Timetable.type";
import type { CourseEntry } from "$lib/types/CourseEntry.type";


export const TimetableStore = readable<Timetable | null>(await getTimetable());
export const CourseEntriesStore: Readable<Map<CourseEntry["id"], CourseEntry>> = derived(
    [TimetableStore],
    ([$timetable]): Map<CourseEntry["id"], CourseEntry> => {
        if (!$timetable) return new Map();
        return new Map($timetable.courses.map(course => [course.id, course]));
    }
)