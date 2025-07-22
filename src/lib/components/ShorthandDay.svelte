<script lang="ts">
    import type { Day } from "$lib/types/courseEntry.type";

    let { day }: { day: Day } = $props();

    const shortMap: Record<Day, string> = {
        Monday: "Mo",
        Tuesday: "Tu",
        Wednesday: "We",
        Thursday: "Th",
        Friday: "Fr",
        Saturday: "Sa",
        Sunday: "Su",
    };
</script>

<li>
    {shortMap[day]}
</li>
