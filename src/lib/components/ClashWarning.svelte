<script lang="ts">
    import { TimetableStore } from "$lib/stores/TimetableStore";
    import type { CourseEntry } from "$lib/types/CourseEntry.type";
    import { Tooltip } from "bits-ui";
    import DOMPurify from "dompurify";

    let { clashesWith }: { clashesWith: CourseEntry["id"][] } = $props();

    const renderCourseComponent = (c: CourseEntry["component"]): string => {
        const [type, number] = c;
        return `${type}${number}`;
    };

    const tooltipText = $derived.by(() => {
        const clashingCourses = $TimetableStore!.courses.filter((c) =>
            clashesWith.includes(c.id),
        );

        if (clashingCourses.length === 0) {
            return DOMPurify.sanitize("No time conflicts detected");
        }

        const entries = clashingCourses.map(
            (c) =>
                `${c.course_code} - ${renderCourseComponent(c.component)} - ${c.course_name}`,
        );

        return DOMPurify.sanitize(
            `Clashes with:<br />${entries.join("<br />")}`,
        );
    });
</script>

<Tooltip.Provider>
    <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger class={`absolute top-2 right-2 cursor-pointer`}>
            {@render warningSvg()}
        </Tooltip.Trigger>

        <Tooltip.Content
            side={"bottom"}
            sideOffset={8}
            class={`z-40 px-4 py-2 bg-neutral-200 border-2 border-neutral-800 rounded-md`}
        >
            {@html tooltipText}
        </Tooltip.Content>
    </Tooltip.Root>
</Tooltip.Provider>

{#snippet warningSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-[24px] aspect-square fill-none stroke-2 stroke-current lucide lucide-triangle-alert-icon lucide-triangle-alert"
    >
        <path
            d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
        />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
    </svg>
{/snippet}
