<script lang="ts">
    import {
        clearSelectedCourses,
        SelectedEntriesStore,
    } from "$lib/stores/SelectedEntriesStore";
    import { TimetableStore } from "$lib/stores/TimetableStore";
    import RenderCourseEntry from "$lib/components/RenderCourseEntry/RenderCourseEntry.svelte";
    import Spinner from "$lib/components/Galleries/Spinner.svelte";
    import { ClashingCourseEntries } from "$lib/stores/ClashingEntriesStore";
    import { Button, Tooltip } from "bits-ui";
    import CalendarView from "$lib/components/Calendar/CalendarViewButton.svelte";

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

    <div class={`flex gap-2`}>
        <Button.Root
            onclick={clearSelectedCourses}
            class={`flex items-center gap-1 px-2 py-1 text-sm hover:bg-red-400 border-2 border-neutral-800 rounded-md cursor-pointer transition-colors duration-200`}
        >
            Clear All
            {@render binSvg()}
        </Button.Root>

        <CalendarView disabled={clashingEntriesWithinSelectedExist} />

        {#if clashingEntriesWithinSelectedExist}
            <Tooltip.Provider delayDuration={200}>
                <Tooltip.Root>
                    <Tooltip.Trigger class={`cursor-pointer`}>
                        {@render infoSvg()}
                    </Tooltip.Trigger>

                    <Tooltip.Content
                        side={"left"}
                        sideOffset={8}
                        class={`z-40 bg-neutral-50 p-2 border-2 border-neutral-800 rounded-md`}
                    >
                        Resolve all clashes to access calendar view
                    </Tooltip.Content>
                </Tooltip.Root>
            </Tooltip.Provider>
        {/if}
    </div>

    {#if selectedCourseEntries}
        {#if selectedCourseEntries.length > 0}
            <ul class={`flex flex-col gap-4 mt-2`}>
                {#each selectedCourseEntries as course}
                    <RenderCourseEntry {course} hide={false} />
                {/each}
            </ul>
        {:else}
            <div
                class={`flex flex-col items-center py-4 mt-2 text-neutral-600 border-4 border-neutral-400 rounded-md`}
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

{#snippet binSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`h-4.5 aspect-square fill-none stroke-current stroke-2 lucide lucide-trash-icon lucide-trash`}
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
{/snippet}

{#snippet infoSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`h-6 aspect-square fill-none stroke-current stroke-2 lucide lucide-info-icon lucide-info`}
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
    </svg>
{/snippet}
