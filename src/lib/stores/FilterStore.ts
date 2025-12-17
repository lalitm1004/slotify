import { ComponentTypeEnum, type ComponentType, type CourseEntry } from "$lib/types/CourseEntry.type";
import { derived, writable, type Readable } from "svelte/store";
import Fuse from "fuse.js";
import { SelectedEntriesStore } from "$lib/stores/SelectedEntriesStore";
import { CourseEntriesStore } from "$lib/stores/TimetableStore";
import { ClashingCourseEntries } from "$lib/stores/ClashingEntriesStore";

interface Filter {
    components: Set<ComponentType>;

    showClashing: boolean;
    uweStrictMode: boolean;

    courseCodeQuery: string;
    courseNameQuery: string;
    studentGroupQuery: string;
};

export const FilterStore = writable<Filter>({
    components: new Set(ComponentTypeEnum.options),
    showClashing: true,
    uweStrictMode: false,
    courseCodeQuery: "",
    courseNameQuery: "",
    studentGroupQuery: "",
});

export const FilteredCourseEntries: Readable<Set<CourseEntry["id"]>> = derived(
    [FilterStore, SelectedEntriesStore, CourseEntriesStore, ClashingCourseEntries],
    ([$filter, $selectedEntries, $courseEntries, $clashingEntries]) => {
        if ($courseEntries.size === 0) {
            return new Set<string>();
        }


        let candidates = [...$courseEntries.keys()];

        // filter out selected courses
        candidates = candidates.filter(id => !$selectedEntries.has(id));

        // only include open_as_uwe courses
        if ($filter.uweStrictMode) {
            candidates = candidates.filter(id => {
                const course = $courseEntries.get(id);
                if (course) {
                    return course.open_as_uwe
                }
                return false;
            });
        }

        // component type filter
        candidates = candidates.filter(id => {
            const course = $courseEntries.get(id);
            if (course) {
                return $filter.components.has(course.component[0])
            }
        });

        // exclude clashing entries
        if (!$filter.showClashing) {
            candidates = candidates.filter(id => !$clashingEntries.has(id));
        }


        // course_codes
        const courseCodeQuery = $filter.courseCodeQuery.trim();
        if (courseCodeQuery.length > 0) {
            const query = courseCodeQuery.toUpperCase();

            candidates = candidates.filter(id => {
                const course = $courseEntries.get(id);
                if (course) {
                    return course.course_codes.some(code => code.toUpperCase().includes(query));
                }
                return false;
            });
        }

        // student_groups
        const studentGroupQuery = $filter.studentGroupQuery.trim();
        if (studentGroupQuery.length > 0) {
            const tokens = studentGroupQuery
                .toUpperCase()
                .split(/[,\s/]+/)
                .filter(token => token.trim().length > 0);

            candidates = candidates.filter(id => {
                const course = $courseEntries.get(id);
                if (!course) {
                    return false
                }
                return tokens.some(token =>
                    course.student_groups.some(group =>
                        group
                            .toUpperCase()
                            .trim()
                            .includes(token)
                    )
                );
            });
        }

        // course_name fuzzy matching
        const courseNameQuery = $filter.courseNameQuery.trim();
        if (courseNameQuery.length > 0) {
            const candidateCourses = candidates.map(id => $courseEntries.get(id)!);
            const fuse = new Fuse(candidateCourses, {
                keys: ["course_name"],
                threshold: 0.4,
            });
            const results = fuse.search(courseNameQuery);
            return new Set(results.map(r => r.item.id));
        }

        return new Set(candidates);
    }
)