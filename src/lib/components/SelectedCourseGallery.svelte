<script>
    import { CourseEntryStore } from "$lib/stores/CourseEntryStore";
    import {
        clearSelectedCourses,
        SelectedCoursesStore,
    } from "$lib/stores/SelectedCoursesStore";
    import { Button } from "bits-ui";
    import RenderCourseEntry from "./RenderCourseEntry.svelte";
    import { Trash } from "@lucide/svelte";

    const selectedCourses = $derived.by(() => {
        return $CourseEntryStore.filter((c) =>
            ($SelectedCoursesStore ?? []).includes(c.id),
        );
    });
</script>

<div
    class={`relative w-full flex flex-col gap-4 p-4 borde/r-2 border-neutral-800 rounded-md`}
>
    <div class={`flex items-center justify-between`}>
        <p class={`font-amulya font-bold text-xl`}>Selected Courses</p>

        <Button.Root
            onclick={() => clearSelectedCourses()}
            class={`flex items-center gap-2 px-2 py-1 tracking-tighter border-2 border-neutral-800 hover:bg-red-400 rounded-md cursor-pointer transition-colors duration-200`}
        >
            Clear All
            <Trash />
        </Button.Root>
    </div>

    <ul class={`flex flex-col gap-2`}>
        {#each selectedCourses as course}
            <RenderCourseEntry
                {course}
                shouldDisplay={true}
                isClashing={false}
                clashingWith={[]}
                isSelected={true}
            />
        {/each}
    </ul>
</div>
