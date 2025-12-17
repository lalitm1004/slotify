<script lang="ts">
    import { ClashingCourseEntries } from "$lib/stores/ClashingEntriesStore";
    import type { CourseEntry } from "$lib/types/CourseEntry.type";
    import RenderTimeSlots from "$lib/components/RenderCourseEntry/RenderTimeSlots.svelte";
    import ClashWarning from "$lib/components/RenderCourseEntry/ClashWarning.svelte";
    import {
        selectCourse,
        SelectedEntriesStore,
        unselectCourse,
    } from "$lib/stores/SelectedEntriesStore";
    import { Button } from "bits-ui";

    interface Props {
        course: CourseEntry;
        hide: boolean;
    }
    const { course, hide }: Props = $props();

    const clashesWith: CourseEntry["id"][] = $derived(
        $ClashingCourseEntries.get(course.id) ?? [],
    );

    const isSelected: boolean = $derived($SelectedEntriesStore.has(course.id));

    const parseCourseComponent = (c: CourseEntry["component"]): string => {
        const [type, number] = c;
        return `${type}${number}`;
    };

    const handleSelectCourse = (): void => {
        selectCourse(course.id);
    };

    const handleUnselectCourse = (): void => {
        unselectCourse(course.id);
    };
</script>

<li
    data-hide={hide}
    class={`relative flex flex-col p-2 border-2 border-neutral-800 rounded-md data-[hide=true]:hidden`}
>
    {#if isSelected}
        <div class={`absolute top-2 right-2`}>
            <Button.Root
                aria-label={`unselect course entry`}
                onclick={handleUnselectCourse}
                class={`hover:bg-red-400 border-2 border-neutral-800 rounded-md cursor-pointer transition-colors duration-200`}
            >
                {@render minusSvg()}
            </Button.Root>
        </div>
    {:else if clashesWith.length > 0}
        <ClashWarning {clashesWith} />
    {:else}
        <Button.Root
            aria-label={`select course entry`}
            onclick={handleSelectCourse}
            class={`absolute top-2 right-2 hover:bg-green-400 border-2 border-neutral-800 rounded-md cursor-pointer transition-colors duration-200`}
        >
            {@render plusSvg()}
        </Button.Root>
    {/if}

    <p>
        {course.course_codes.join("/")}
        {" - "}
        {parseCourseComponent(course.component)}
    </p>

    <RenderTimeSlots timeSlots={course.timeslots} />

    <p>{course.course_name}</p>

    <p class={`text-sm`}>Groups: {course.student_groups.join(",")}</p>

    <p class={`text-sm`}>
        Open as UWE:
        <span>
            {#if course.open_as_uwe}
                Yes
            {:else}
                No
            {/if}
        </span>
    </p>
</li>

{#snippet minusSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`h-6 aspect-square fill-none stroke-2 stroke-current lucide lucide-minus-icon lucide-minus`}
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M5 12h14" />
    </svg>
{/snippet}

{#snippet plusSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`h-6 aspect-square fill-none stroke-2 stroke-current lucide lucide-plus-icon lucide-plus`}
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
{/snippet}
