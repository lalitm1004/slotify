<script lang="ts">
    import ngmiPng from "$lib/assets/ngmi.png";
    import { TimetableStore } from "$lib/stores/TimetableStore";
    import RenderCourseEntry from "$lib/components/RenderCourseEntry/RenderCourseEntry.svelte";
    import Spinner from "$lib/components/Galleries/Spinner.svelte";
    import { FilteredCourseEntries } from "$lib/stores/FilterStore";

    let someVisible = $derived.by(() => {
        if ($TimetableStore) {
            return $TimetableStore.courses.some((course) =>
                $FilteredCourseEntries.has(course.id),
            );
        }

        return false;
    });
</script>

{#if $TimetableStore}
    <ul class={`grid grid-cols-3 gap-4 p-2`}>
        {#each $TimetableStore.courses as course}
            {@const hide = !$FilteredCourseEntries.has(course.id)}
            <RenderCourseEntry {course} {hide} />
        {/each}
    </ul>

    {#if !someVisible}
        <img
            class={`h-[50dvh] mt-[15dvh] aspect-square mx-auto`}
            src={ngmiPng}
            alt={`lowkuinely ngmi`}
            fetchpriority={`high`}
        />
    {/if}
{:else}
    <div class={`h-[80dvh] w-full grid place-items-center`}>
        <Spinner />
    </div>
{/if}
