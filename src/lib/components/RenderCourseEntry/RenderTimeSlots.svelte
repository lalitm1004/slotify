<script lang="ts">
    import { TimeFormatStore } from "$lib/stores/MiscStores";
    import type { CourseEntry } from "$lib/types/CourseEntry.type";
    import type { Day } from "$lib/types/TimeSlot.type";

    interface Props {
        timeSlots: CourseEntry["timeslots"];
    }
    const { timeSlots }: Props = $props();

    const dayToStrMap: Record<Day, string> = {
        Monday: "Mo",
        Tuesday: "Tu",
        Wednesday: "We",
        Thursday: "Th",
        Friday: "Fr",
        Saturday: "Sa",
        Sunday: "Su",
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
</script>

<ul class={`flex flex-col text-sm`}>
    {#each timeSlots as timeSlot}
        <li class={`flex`}>
            {#if timeSlot.start_time && timeSlot.end_time}
                <div class={`flex gap-1`}>
                    <time datetime={timeSlot.start_time}>
                        {formatTime(timeSlot.start_time)}
                    </time>

                    <p>-</p>

                    <time datetime={timeSlot.end_time}>
                        {formatTime(timeSlot.end_time)}
                    </time>
                </div>
            {:else}
                <p>TBA</p>
            {/if}

            <p>,</p>

            <ol class={`flex ml-1`}>
                {#each timeSlot.days as day}
                    <li>{dayToStrMap[day]}</li>
                {/each}
            </ol>
        </li>
    {/each}
</ul>
