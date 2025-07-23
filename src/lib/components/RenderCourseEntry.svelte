<script lang="ts">
    import { Use12HFormat } from "$lib/stores/MiscStores";
    import type { CourseEntry } from "$lib/types/courseEntry.type";
    import { Button, Tooltip } from "bits-ui";
    import ShorthandDay from "./ShorthandDay.svelte";
    import { Minus, Plus, TriangleAlert } from "@lucide/svelte";
    import {
        selectCourse,
        unselectCourse,
    } from "$lib/stores/SelectedCoursesStore";
    import ClashAlert from "./ClashAlert.svelte";

    let {
        course,
        shouldDisplay,
        isClashing,
        clashingWith,
        isSelected,
    }: {
        course: CourseEntry;
        shouldDisplay: boolean;
        isClashing: boolean;
        clashingWith: CourseEntry["id"][];
        isSelected: boolean;
    } = $props();

    const renderCourseComponent = (c: CourseEntry["component"]): string => {
        const [type, number] = c;
        return `${type}${number}`;
    };

    const formatTime = (timeStr: string): string => {
        const [hourStr, minuteStr] = timeStr.split(":");
        let hour = parseInt(hourStr);
        const minute = minuteStr.padStart(2, "0");

        if ($Use12HFormat) {
            const suffix = hour >= 12 ? "PM" : "AM";
            hour = hour % 12;
            if (hour === 0) hour = 12;
            return `${hour}:${minute}${suffix}`;
        }

        return `${hour.toString().padStart(2, "0")}:${minute}`;
    };
</script>

<li
    data-clashing={isClashing}
    data-display={shouldDisplay}
    class={`relative flex flex-col px-3 py-2 text-md border-2 border-neutral-800 rounded-md data-[display=false]:hidden`}
>
    <div class={`absolute top-2 right-2`}>
        {#if isSelected}
            <Button.Root
                onclick={() => unselectCourse(course.id)}
                class={`border-2 border-neutral-800 rounded-md cursor-pointer hover:bg-red-400 transition-colors duration-200`}
            >
                <Minus size={24} />
            </Button.Root>
        {:else if isClashing}
            <ClashAlert {clashingWith} />
        {:else}
            <Button.Root
                onclick={() => selectCourse(course.id)}
                class={`border-2 border-neutral-800 rounded-md cursor-pointer hover:bg-green-400 transition-colors duration-200`}
            >
                <Plus size={24} />
            </Button.Root>
        {/if}
    </div>

    <p>
        {course.course_code}
        {" - "}
        {renderCourseComponent(course.component)}
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

        {" | "}

        <ol class={`flex gap-[2px] px-1`}>
            {#each course.days as day}
                <ShorthandDay {day} />
            {/each}
        </ol>
    </div>

    <p>{course.course_name}</p>

    <p class={`text-sm`}>Major: {course.major}</p>
    <div class={`flex items-center gap-1 text-sm`}>
        <p class={``}>Open as UWE:</p>

        {#if course.open_as_uwe}
            True
        {:else}
            False
        {/if}
    </div>
</li>
