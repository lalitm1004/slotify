<script lang="ts">
    import { CourseEntryStore } from "$lib/stores/CourseEntryStore";
    import type { CourseEntry } from "$lib/types/courseEntry.type";
    import { TriangleAlert } from "@lucide/svelte";
    import { Tooltip } from "bits-ui";

    let { clashingWith }: { clashingWith: CourseEntry["id"][] } = $props();

    const renderCourseComponent = (c: CourseEntry["component"]): string => {
        const [type, number] = c;
        return `${type}${number}`;
    };

    const tooltipText = $derived.by(() => {
        const clashingCourses = $CourseEntryStore.filter((c) =>
            clashingWith.includes(c.id),
        );

        if (clashingCourses.length === 0) {
            return "No time conflicts detected.";
        }

        const entries = clashingCourses.map(
            (c) =>
                `${c.course_code} - ${renderCourseComponent(c.component)} - ${c.course_name}`,
        );

        return `Clashes with:<br />${entries.join("<br />")}`;
    });
</script>

<Tooltip.Provider>
    <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger class={`cursor-pointer`}>
            <TriangleAlert />
        </Tooltip.Trigger>

        <Tooltip.Content side={"bottom"} sideOffset={8} class={`z-40`}>
            <div
                class={`px-4 py-2 bg-neutral-200 border-2 border-neutral-800 rounded-md`}
            >
                {@html tooltipText}
            </div>
        </Tooltip.Content>
    </Tooltip.Root>
</Tooltip.Provider>
