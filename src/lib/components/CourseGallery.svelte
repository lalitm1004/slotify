<script lang="ts">
    import { TimetableStore } from "$lib/stores/TimetableStore";
    import RenderCourseEntry from "$lib/components/RenderCourseEntry/RenderCourseEntry.svelte";
</script>

{#if $TimetableStore}
    <ul class={`grid md:grid-cols-4 grid-cols-1 gap-4 p-2`}>
        {#each $TimetableStore.courses as course}
            <li>
                <RenderCourseEntry {course} hide={false} />
            </li>
        {/each}
    </ul>
{/if}
