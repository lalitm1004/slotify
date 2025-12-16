<script lang="ts">
    import { TimetableStore } from "$lib/stores/TimetableStore";
    import RenderCourseEntry from "./RenderCourseEntry.svelte";
</script>

{#if $TimetableStore}
    <ul class={`grid md:grid-cols-3 grid-cols-2 gap-4 p-2`}>
        {#each $TimetableStore.courses as course}
            <li>
                <RenderCourseEntry {course} shouldHide={false} />
            </li>
        {/each}
    </ul>
{/if}
