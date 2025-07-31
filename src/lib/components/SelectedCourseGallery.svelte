<script lang="ts">
    import {
        clearSelectedCourses,
        SelectedEntriesStore,
    } from "$lib/stores/SelectedEntriesStore";
    import { TimetableStore } from "$lib/stores/TimetableStore";
    import { Button } from "bits-ui";
    import CourseEntry from "./CourseEntry.svelte";
    import Spinner from "./Spinner.svelte";

    let selectedCourses = $derived.by(() => {
        if ($TimetableStore) {
            return $TimetableStore.courses.filter((c) =>
                ($SelectedEntriesStore ?? new Set()).has(c.id),
            );
        }

        return null;
    });
</script>

<div class={`h-full w-full flex flex-col gap-2`}>
    <div class={`h-[40px] flex justify-between items-center`}>
        <p class={`font-amulya font-bold text-xl`}>Selected Courses</p>

        <Button.Root
            onclick={clearSelectedCourses}
            class={`flex items-center gap-1 px-2 py-1 text-sm hover:bg-red-400 border-2 border-neutral-800 rounded-md cursor-pointer transition-colors duration-200`}
        >
            Clear All

            {@render trashSvg()}
        </Button.Root>
    </div>

    {#if selectedCourses}
        {#if selectedCourses.length > 0}
            <ul class={`flex flex-col gap-4`}>
                {#each selectedCourses as course (course.id)}
                    <CourseEntry {course} shouldHide={false} clashesWith={[]} />
                {/each}
            </ul>
        {:else}
            <p
                class={`text-center py-4 border-4 text-neutral-600 border-neutral-400 rounded-md`}
            >
                Select a course to begin
                <br />
                filtering out clashes
            </p>
        {/if}
    {:else}
        <div class={`grid place-items-center mt-10`}>
            <Spinner />
        </div>
    {/if}
</div>

{#snippet trashSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-[18px] aspect-square fill-none stroke-2 stroke-current lucide lucide-trash2-icon lucide-trash-2"
    >
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
{/snippet}
