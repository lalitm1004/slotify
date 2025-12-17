<script lang="ts">
    import { TimetableStore } from "$lib/stores/TimetableStore";
    import RenderCourseEntry from "$lib/components/RenderCourseEntry/RenderCourseEntry.svelte";
    import Spinner from "$lib/components/Galleries/Spinner.svelte";
    import { SelectedEntriesStore } from "$lib/stores/SelectedEntriesStore";
</script>

{#if $TimetableStore}
    <ul class={`grid grid-cols-3 gap-4 p-2`}>
        {#each $TimetableStore.courses as course}
            <RenderCourseEntry {course} hide={false} />
        {/each}
    </ul>
{:else}
    <div class={`h-[80dvh] w-full grid place-items-center`}>
        <Spinner />
    </div>
{/if}
