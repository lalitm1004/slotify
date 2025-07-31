<script lang="ts">
    import { TimeFormatStore } from "$lib/stores/MiscStores";
    import {
        selectCourse,
        SelectedEntriesStore,
        unselectCourse,
    } from "$lib/stores/SelectedEntriesStore";
    import type { CourseEntry } from "$lib/types/CourseEntry.type";
    import type { Day } from "$lib/types/Day.type";
    import { Button } from "bits-ui";
    import ClashWarning from "./ClashWarning.svelte";

    const {
        course,
        shouldHide,
        clashesWith,
    }: {
        course: CourseEntry;
        clashesWith: CourseEntry["id"][];
        shouldHide: boolean;
    } = $props();

    let isSelected = $derived.by(() => {
        const selected = $SelectedEntriesStore ?? new Set();
        return selected.has(course.id);
    });

    let clashing = $derived(clashesWith.length > 0);

    const shortMap: Record<Day, string> = {
        Monday: "Mo",
        Tuesday: "Tu",
        Wednesday: "We",
        Thursday: "Th",
        Friday: "Fr",
        Saturday: "Sa",
        Sunday: "Su",
    };

    const parseCourseComponent = (c: CourseEntry["component"]): string => {
        const [type, number] = c;
        return `${type}${number}`;
    };

    const formatTime = (timeStr: string): string => {
        const [hourStr, minuteStr] = timeStr.split(":");
        let hour = parseInt(hourStr);
        const minute = minuteStr.padStart(2, "0");

        if ($TimeFormatStore === "12H") {
            const suffix = hour >= 12 ? "PM" : "AM";
            hour = hour % 12;
            if (hour === 0) hour = 12;
            return `${hour}:${minute}${suffix}`;
        }

        return `${hour.toString().padStart(2, "0")}:${minute}`;
    };

    const handleSelectCourse = (event: MouseEvent) => {
        const target = event.currentTarget as HTMLButtonElement;

        const id = target.dataset.id;
        if (id) selectCourse(id);
    };

    const handleUnselectCourse = (event: MouseEvent) => {
        const target = event.currentTarget as HTMLButtonElement;

        const id = target.dataset.id;
        if (id) unselectCourse(id);
    };
</script>

<li
    data-clashing={clashing}
    data-shouldHide={shouldHide}
    class={`relative flex flex-col p-2 text-sm border-2 border-neutral-800 rounded-md data-[shouldHide=true]:hidden`}
>
    {#if isSelected}
        <Button.Root
            data-id={course.id}
            onclick={handleUnselectCourse}
            class={`absolute top-2 right-2 hover:bg-red-400 border-2 border-neutral-800 rounded-md cursor-pointer transition-colors duration-200`}
        >
            <p class={`sr-only`}>Unselect Course</p>

            {@render minusSvg()}
        </Button.Root>
    {:else if clashing}
        <ClashWarning {clashesWith} />
    {:else}
        <Button.Root
            data-id={course.id}
            onclick={handleSelectCourse}
            class={`absolute top-2 right-2 hover:bg-green-400 border-2 border-neutral-800 rounded-md cursor-pointer transition-colors duration-200`}
        >
            <p class={`sr-only`}>Select Course</p>

            {@render plusSvg()}
        </Button.Root>
    {/if}

    <p class={`text-base`}>
        {course.course_code}
        {" - "}
        {parseCourseComponent(course.component)}
    </p>

    <div class={`flex items-center`}>
        <span>
            {#if course.start_time && course.end_time}
                <span>
                    <time datetime={course.start_time}>
                        {formatTime(course.start_time)}
                    </time>

                    {" - "}

                    <time datetime={course.end_time}>
                        {formatTime(course.end_time)}
                    </time>
                </span>
            {:else}
                <time>TBA</time>
            {/if}
        </span>

        {","}

        <ol class={`flex ml-1`}>
            {#each course.days as day, idx (idx)}
                <li>{shortMap[day]}</li>
            {/each}
        </ol>
    </div>

    <p class={`text-base`}>{course.course_name}</p>

    <p class={`text-sm`}>Major: {course.major}</p>

    <div class={`flex items-center gap-1 text-sm`}>
        <p>Open as UWE:</p>

        {#if course.open_as_uwe}
            Yes
        {:else}
            No
        {/if}
    </div>
</li>

{#snippet minusSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-[24px] aspect-square fill-none stroke-2 stroke-current lucide lucide-minus-icon lucide-minus"
    >
        <path d="M5 12h14" />
    </svg>
{/snippet}

{#snippet plusSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-[24px] aspect-square fill-none stroke-2 stroke-current lucide lucide-plus-icon lucide-plus"
    >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
{/snippet}
