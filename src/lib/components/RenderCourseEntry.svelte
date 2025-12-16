<script lang="ts">
    import { ClashingCourseEntries } from "$lib/stores/ClashingEntriesStore";
    import type { CourseEntry } from "$lib/types/CourseEntry.type";

    interface Props {
        course: CourseEntry;
        shouldHide: boolean;
    }
    const { course, shouldHide }: Props = $props();
    const clashesWith: CourseEntry["id"][] = $derived(
        $ClashingCourseEntries.get(course.id) ?? [],
    );

    const parseCourseComponent = (c: CourseEntry["component"]): string => {
        const [type, number] = c;
        return `${type}${number}`;
    };
</script>

<div
    data-shouldHide={shouldHide}
    class={`flex flex-col p-2 border-2 border-neutral-800 rounded-md data-[shouldHide=true]:hidden`}
>
    <p class={`text-base`}>
        {course.course_codes.join("/")}
        {" - "}
        {parseCourseComponent(course.component)}
    </p>
</div>
