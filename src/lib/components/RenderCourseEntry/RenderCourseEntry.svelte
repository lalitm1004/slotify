<script lang="ts">
    import { ClashingCourseEntries } from "$lib/stores/ClashingEntriesStore";
    import type { CourseEntry } from "$lib/types/CourseEntry.type";
    import RenderTimeSlots from "$lib/components/RenderCourseEntry/RenderTimeSlots.svelte";
    import { SelectedEntriesStore } from "$lib/stores/SelectedEntriesStore";

    interface Props {
        course: CourseEntry;
        hide: boolean;
    }
    const { course, hide: shouldHide }: Props = $props();

    const clashesWith: CourseEntry["id"][] = $derived(
        $ClashingCourseEntries.get(course.id) ?? [],
    );

    const isSelected = $derived($SelectedEntriesStore.has(course.id));

    const parseCourseComponent = (c: CourseEntry["component"]): string => {
        const [type, number] = c;
        return `${type}${number}`;
    };
</script>

<div
    data-hide={shouldHide}
    class={`flex flex-col p-2 border-2 border-neutral-800 rounded-md data-[hide=true]:hidden`}
>
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
</div>
