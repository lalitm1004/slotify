<script lang="ts">
    import {
        CourseEntriesStore,
        TimetableStore,
    } from "$lib/stores/TimetableStore";
</script>

{#each $CourseEntriesStore as c}
    <pre>{JSON.stringify(c[1], null, 2)}</pre>
{/each}
