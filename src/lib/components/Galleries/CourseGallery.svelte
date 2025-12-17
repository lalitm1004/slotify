<script lang="ts">
    import { TimetableStore } from "$lib/stores/TimetableStore";
    import RenderCourseEntry from "$lib/components/RenderCourseEntry/RenderCourseEntry.svelte";
    import Spinner from "$lib/components/Galleries/Spinner.svelte";
</script>

{#if $TimetableStore}
    <ul class={`grid grid-cols-3 gap-4 p-2`}>
        {#each $TimetableStore.courses as course}
            <li>
                <RenderCourseEntry {course} hide={false} />
            </li>
        {/each}
    </ul>
{:else}
    <div class={`h-[80dvh] w-full grid place-items-center`}>
        <Spinner />
    </div>
{/if}
