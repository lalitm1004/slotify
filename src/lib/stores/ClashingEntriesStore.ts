import type { CourseEntry } from "$lib/types/CourseEntry.type";
import { derived, type Readable } from "svelte/store";
import { CourseEntriesStore } from "./TimetableStore";
import { SelectedEntriesStore } from "./SelectedEntriesStore";

export const ClashingCourseEntries: Readable<Map<CourseEntry["id"], CourseEntry["id"][]>> = derived(
    [SelectedEntriesStore, CourseEntriesStore],
    ([$selectedEntries, $courseEntries]) => {
        if (!$selectedEntries || $selectedEntries.size === 0 || $courseEntries.size === 0) {
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