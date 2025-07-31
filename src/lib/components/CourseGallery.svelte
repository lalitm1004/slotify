<script lang="ts">
    import { TimetableStore } from "$lib/stores/TimetableStore";
    import CourseEntry from "./CourseEntry.svelte";
    import Spinner from "./Spinner.svelte";
    import type { CourseEntry as CourseEntryT } from "$lib/types/CourseEntry.type";
    import { SelectedEntriesStore } from "$lib/stores/SelectedEntriesStore";
    import { Checkbox, Label } from "bits-ui";
    import Fuse from "fuse.js";

    let courseCodeFilter = $state("");
    let courseNameFilter = $state("");
    let showOpenAsUWE = $state(false);

    let allCourses = $derived($TimetableStore?.courses ?? []);

    let filteredCourseIds: Set<CourseEntryT["id"]> = $derived.by(() => {
        let filtered = allCourses;

        if (courseCodeFilter.trim()) {
            filtered = filtered.filter((c) =>
                c.course_code
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
            filtered = results.map((result) => result.item);
        }

        if (showOpenAsUWE) {
            filtered = filtered.filter((c) => c.open_as_uwe);
        }

        return new Set(filtered.map((c) => c.id));
    });

    const shouldHide = (id: CourseEntryT["id"]): boolean => {
        if (($SelectedEntriesStore ?? new Set()).has(id)) {
            return true;
        }

        if (!filteredCourseIds.has(id)) {
            return true;
        }

        return false;
    };

    const toMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const getClashes = (course: CourseEntryT): CourseEntryT["id"][] => {
        if (!course.start_time || !course.end_time || !$TimetableStore)
            return [];

        const courseStart = toMinutes(course.start_time);
        const courseEnd = toMinutes(course.end_time);

        const selectedCourses = $TimetableStore.courses.filter((c) =>
            ($SelectedEntriesStore ?? new Set()).has(c.id),
        );

        return selectedCourses
            .filter((selectedCourse) => {
                if (!selectedCourse.start_time || !selectedCourse.end_time)
                    return false;

                const hasSharedDay = course.days.some((day) =>
                    selectedCourse.days.includes(day),
                );

                if (!hasSharedDay) return false;

                const selectedStart = toMinutes(selectedCourse.start_time);
                const selectedEnd = toMinutes(selectedCourse.end_time);

                return courseStart < selectedEnd && selectedStart < courseEnd;
            })
            .map((c) => c.id);
    };
</script>

<div class={`h-full w-full flex flex-col gap-4`}>
    <form class={`flex flex-col gap-1`}>
        <div class={`flex items-center gap-2`}>
            <Label.Root id={`open-as-uwe-label`} for={`open-as-uwe`}>
                Only show courses open as UWE:
            </Label.Root>

            <Checkbox.Root
                bind:checked={showOpenAsUWE}
                id={`open-as-uwe`}
                aria-labelledby={`open-as-uwe-label`}
                class={`h-[24px] aspect-square grid place-items-center border-2 border-neutral-800 rounded-md cursor-pointer`}
            >
                {#snippet children({ checked })}
                    {#if checked}
                        {@render checkSvg()}
                    {/if}
                {/snippet}
            </Checkbox.Root>
        </div>

        <div class={`w-full flex gap-2`}>
            <div>
                <Label.Root id={`course-code-label`} for={`course-code`}>
                    Course Code:
                </Label.Root>

                <input
                    bind:value={courseCodeFilter}
                    id={`course-code`}
                    aria-labelledby={`course-code-label`}
                    class={` w-[9ch] px-2 border-2 border-neutral-800 rounded-md`}
                    placeholder={`ABC123`}
                />
            </div>

            <div class={`flex flex-grow gap-2`}>
                <Label.Root
                    id={`course-name-label`}
                    for={`course-name`}
                    class={`text-nowrap`}
                >
                    Course Name:
                </Label.Root>

                <input
                    bind:value={courseNameFilter}
                    id={`course-name`}
                    aria-labelledby={`course-name-label`}
                    class={`flex-grow px-2 border-2 border-neutral-800 rounded-md`}
                    placeholder={`Introduction to Programming`}
                />
            </div>
        </div>
    </form>

    <div class={`h-[1.5px] w-full border border-neutral-800`}></div>

    {#if $TimetableStore}
        <ul class={`grid grid-cols-3 gap-4`}>
            {#each $TimetableStore.courses as course (course.id)}
                <CourseEntry
                    {course}
                    clashesWith={getClashes(course)}
                    shouldHide={shouldHide(course.id)}
                />
            {/each}
        </ul>
    {:else}
        <div class={`h-full flex-grow grid place-items-center`}>
            <Spinner />
        </div>
    {/if}
</div>

{#snippet checkSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-[18px] aspect-square fill-none stroke-2 stroke-current lucide lucide-check-icon lucide-check"
    >
        <path d="M20 6 9 17l-5-5" />
    </svg>
{/snippet}
