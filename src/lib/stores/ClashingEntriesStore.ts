import { derived, type Readable } from "svelte/store";
import type { CourseEntry } from "$lib/types/CourseEntry.type";
import { CourseEntriesStore } from "$lib/stores/TimetableStore";
import { SelectedEntriesStore } from "$lib/stores/SelectedEntriesStore";


export const ClashingCourseEntries: Readable<Map<CourseEntry["id"], CourseEntry["id"][]>> = derived(
    [SelectedEntriesStore, CourseEntriesStore],
    ([$selectedEntries, $courseEntries]) => {
        if (!$selectedEntries) {
            return new Map();
        }

        let clashing: Map<CourseEntry["id"], CourseEntry["id"][]> = new Map();

        for (const selectedId of $selectedEntries) {
            const entry = $courseEntries.get(selectedId);
            if (!entry) continue;

            for (const clashingId of entry.clashing_entries) {
                if (!clashing.has(clashingId)) {
                    clashing.set(clashingId, []);
                }

                clashing.get(clashingId)!.push(selectedId);
            }
        }

        return clashing;
    }
)