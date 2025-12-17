<script lang="ts">
    import { SelectedEntriesStore } from "$lib/stores/SelectedEntriesStore";
    import { TimetableStore } from "$lib/stores/TimetableStore";
    import RenderCourseEntry from "$lib/components/RenderCourseEntry/RenderCourseEntry.svelte";
    import Spinner from "$lib/components/Galleries/Spinner.svelte";
    import { ClashingCourseEntries } from "$lib/stores/ClashingEntriesStore";

    let selectedCourseEntries = $derived.by(() => {
        if ($TimetableStore) {
            return $TimetableStore.courses.filter((course) =>
                $SelectedEntriesStore.has(course.id),
            );
        }

        return null;
    });

    let clashingEntriesWithinSelectedExist: boolean = $derived.by(() => {
        if (!selectedCourseEntries) {
            return false;
        }

        return selectedCourseEntries.some((c) =>
            $ClashingCourseEntries.has(c.id),
        );
    });
</script>

<div class={`h-full w-full flex flex-col gap-2 px-2`}>
    <div class={`w-full flex justify-between items-center`}>
        <p class={`font-amulya font-bold text-2xl`}>Selected Courses</p>
    </div>

    {#if selectedCourseEntries}
        {#if selectedCourseEntries.length > 0}
            <ul class={`flex flex-col gap-4`}>
                {#each selectedCourseEntries as course}
                    <RenderCourseEntry {course} hide={false} />
                {/each}
            </ul>
        {:else}
            <div
                class={`flex flex-col items-center py-4 text-neutral-600 border-4 border-neutral-400 rounded-md`}
            >
                <p>Select a course to begin</p>
                <p>filtering out clashes</p>
            </div>
        {/if}
    {:else}
        <div class={`min-h-[80dvh] w-full grid place-items-center`}>
            <Spinner />
        </div>
    {/if}
</div>
