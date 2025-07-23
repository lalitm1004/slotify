<script lang="ts">
    import { CourseEntryStore } from "$lib/stores/CourseEntryStore";
    import type { CourseEntry } from "$lib/types/courseEntry.type";
    import RenderCourseEntry from "$lib/components/RenderCourseEntry.svelte";
    import { SelectedCoursesStore } from "$lib/stores/SelectedCoursesStore";
    import { Label } from "bits-ui";
    import Fuse from "fuse.js";

    let courseCodeFilter: string = $state("");
    let courseNameFilter: string = $state("");

    let courseEntries = $derived.by(() => $CourseEntryStore ?? []);
    const filteredCourseIDs = $derived.by(() => {
        let filtered = courseEntries;

        if (courseCodeFilter.trim()) {
            filtered = filtered.filter((course) =>
                course.course_code
                    .toLowerCase()
                    .startsWith(courseCodeFilter.trim().toLowerCase()),
            );
        }

        if (courseNameFilter.trim()) {
            const fuse = new Fuse(filtered, {
                keys: ["course_name"],
                threshold: 0.3,
                ignoreLocation: true,
            });

            const results = fuse.search(courseNameFilter.trim());
            return results.map((result) => result.item.id);
        }

        return filtered.map((course) => course.id);
    });

    const shouldDisplay = (course: CourseEntry): boolean => {
        if (!filteredCourseIDs.includes(course.id)) {
            return false;
        }

        if (($SelectedCoursesStore ?? []).includes(course.id)) {
            return false;
        }

        return true;
    };

    const isClashing = (course: CourseEntry): boolean => {
        const selectedCourses = $CourseEntryStore.filter((c) =>
            ($SelectedCoursesStore ?? []).includes(c.id),
        );

        for (const selectedCourse of selectedCourses) {
            const sharedDays = course.days.filter((day) =>
                selectedCourse.days.includes(day),
            );
            if (sharedDays.length === 0) continue;

            if (
                !course.start_time ||
                !course.end_time ||
                !selectedCourse.start_time ||
                !selectedCourse.end_time
            )
                continue;

            const [startA, endA] = [
                toMinutes(course.start_time),
                toMinutes(course.end_time),
            ];
            const [startB, endB] = [
                toMinutes(selectedCourse.start_time),
                toMinutes(selectedCourse.end_time),
            ];

            const overlap = startA < endB && startB < endA;
            if (overlap) return true;
        }

        return false;
    };

    const clashingWith = (course: CourseEntry): CourseEntry["id"][] => {
        const selectedCourses = $CourseEntryStore.filter((c) =>
            ($SelectedCoursesStore ?? []).includes(c.id),
        );

        const clashes: string[] = [];

        for (const selectedCourse of selectedCourses) {
            const sharedDays = course.days.filter((day) =>
                selectedCourse.days.includes(day),
            );

            if (sharedDays.length === 0) continue;

            if (
                !course.start_time ||
                !course.end_time ||
                !selectedCourse.start_time ||
                !selectedCourse.end_time
            )
                continue;

            const [startA, endA] = [
                toMinutes(course.start_time),
                toMinutes(course.end_time),
            ];

            const [startB, endB] = [
                toMinutes(selectedCourse.start_time),
                toMinutes(selectedCourse.end_time),
            ];

            const overlap = startA < endB && startB < endA;

            if (overlap) {
                clashes.push(selectedCourse.id);
            }
        }

        return clashes;
    };

    const toMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };
</script>

<div class={`w-full flex flex-col`}>
    <div class={`flex gap-4`}>
        <div>
            <Label.Root for={`course-code`}>Course Code:</Label.Root>
            <input
                id={`course-code`}
                bind:value={courseCodeFilter}
                class={`w-[100px] px-1 border-2 border-neutral-800 accent-transparent rounded-md`}
            />
        </div>

        <div>
            <Label.Root for={`course-name`}>Course Name:</Label.Root>
            <input
                id={`course-name`}
                bind:value={courseNameFilter}
                class={`px-1 border-2 border-neutral-800 rounded-md`}
            />
        </div>
    </div>

    <hr class={`border border-neutral-800 my-3`} />

    <ul class={`w-full grid grid-cols-3 gap-4`}>
        {#each courseEntries as course}
            <RenderCourseEntry
                {course}
                shouldDisplay={shouldDisplay(course)}
                isClashing={isClashing(course)}
                clashingWith={clashingWith(course)}
                isSelected={false}
            />
        {/each}
    </ul>
</div>
