<script lang="ts">
    import { SelectedEntriesStore } from "$lib/stores/SelectedEntriesStore";
    import { CourseEntriesStore } from "$lib/stores/TimetableStore";
    import { TimeFormatStore } from "$lib/stores/MiscStores";
    import type { CourseEntry } from "$lib/types/CourseEntry.type";
    import { DayEnum, type Day, type TimeSlot } from "$lib/types/TimeSlot.type";
    import { Button, Dialog } from "bits-ui";
    import TimeFormatSwitch from "$lib/components/Header/TimeFormatSwitch.svelte";
    import * as htmlToImage from "html-to-image";

    const selectedCourses: CourseEntry[] = $derived(
        Array.from($SelectedEntriesStore)
            .map((id) => $CourseEntriesStore.get(id))
            .filter((course): course is CourseEntry => Boolean(course)),
    );

    const days: Day[] = DayEnum.options.filter((d) => d !== "Sunday");
    const dayShortNames: Record<Day, string> = {
        Monday: "Mon",
        Tuesday: "Tue",
        Wednesday: "Wed",
        Thursday: "Thu",
        Friday: "Fri",
        Saturday: "Sat",
        Sunday: "Sun",
    };

    // range: 8:00 AM to 7:30 PM
    const startHour = 8;
    const endHour = 19.5;
    const totalMinutes = (endHour - startHour) * 60;

    const timeLabels: string[] = [];
    for (let hour = startHour; hour <= 19; hour++) {
        const suffix = hour >= 12 ? "PM" : "AM";
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        timeLabels.push(`${displayHour}${suffix}`);
    }

    const courseColors = [
        "bg-blue-200 border-blue-400",
        "bg-green-200 border-green-400",
        "bg-purple-200 border-purple-400",
        "bg-orange-200 border-orange-400",
        "bg-pink-200 border-pink-400",
        "bg-teal-200 border-teal-400",
        "bg-yellow-200 border-yellow-400",
        "bg-red-200 border-red-400",
        "bg-indigo-200 border-indigo-400",
        "bg-cyan-200 border-cyan-400",
    ];

    const courseCodeColorMap = $derived.by(() => {
        const uniqueCodes = new Set<string>();
        selectedCourses.forEach((course) => {
            uniqueCodes.add(course.course_codes[0]);
        });
        const colorMap = new Map<string, string>();
        let index = 0;
        uniqueCodes.forEach((code) => {
            colorMap.set(code, courseColors[index % courseColors.length]);
            index++;
        });
        return colorMap;
    });

    const getCourseColor = (courseCode: string): string => {
        return courseCodeColorMap.get(courseCode) ?? courseColors[0];
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

    const timeToMinutes = (timeStr: string): number => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const getTopPercentage = (startTime: string): number => {
        const minutes = timeToMinutes(startTime);
        const startMinutes = startHour * 60;
        return ((minutes - startMinutes) / totalMinutes) * 100;
    };

    const getHeightPercentage = (
        startTime: string,
        endTime: string,
    ): number => {
        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);
        return ((endMinutes - startMinutes) / totalMinutes) * 100;
    };

    interface CourseBlock {
        course: CourseEntry;
        timeslot: TimeSlot;
        day: Day;
        colorClass: string;
        top: number;
        height: number;
    }

    const courseBlocksByDay = $derived.by(() => {
        const blocks: Record<Day, CourseBlock[]> = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: [],
        };

        selectedCourses.forEach((course) => {
            const primaryCourseCode = course.course_codes[0];
            course.timeslots.forEach((timeslot) => {
                if (!timeslot.start_time || !timeslot.end_time) return;

                const top = getTopPercentage(timeslot.start_time);
                const height = getHeightPercentage(
                    timeslot.start_time,
                    timeslot.end_time,
                );

                timeslot.days.forEach((day) => {
                    if (days.includes(day)) {
                        blocks[day].push({
                            course,
                            timeslot,
                            day,
                            colorClass: getCourseColor(primaryCourseCode),
                            top,
                            height,
                        });
                    }
                });
            });
        });

        return blocks;
    });

    const parseCourseComponent = (c: CourseEntry["component"]): string => {
        const [type, number] = c;
        return `${type}${number}`;
    };

    let calendarDiv: HTMLDivElement;
    let containerDiv: HTMLDivElement;
    const handleDownload = async () => {
        if (!calendarDiv) return;

        const originalOverflow = containerDiv?.style.overflow;
        const originalHeight = containerDiv?.style.height;

        if (containerDiv) {
            containerDiv.style.overflow = "visible";
            containerDiv.style.height = "auto";
        }

        const dataUrl = await htmlToImage.toPng(calendarDiv, {
            width: calendarDiv.scrollWidth,
            height: calendarDiv.scrollHeight,
            style: {
                overflow: "visible",
            },
        });

        if (containerDiv) {
            containerDiv.style.overflow = originalOverflow;
            containerDiv.style.height = originalHeight;
        }

        const link = document.createElement("a");
        link.download = "calendar.png";
        link.href = dataUrl;
        link.click();
    };
</script>

<div
    bind:this={containerDiv}
    class={`h-[95dvh] w-[95dvw] bg-neutral-50 overflow-x-hidden overflow-y-scroll flex flex-col gap-4 p-4 border-2 border-neutral-800 rounded-md`}
>
    <div class={`w-full flex justify-between items-center`}>
        <p
            class={`flex items-center gap-2 font-amulya font-bold text-2xl ml-6`}
        >
            Calendar View
        </p>

        <div class={`flex items-center gap-4`}>
            <Button.Root
                onclick={handleDownload}
                class={`flex items-center gap-2 px-2 hover:bg-neutral-300 border-2 border-neutral-800 rounded-md transitions-colors duration-200 cursor-pointer`}
            >
                {@render cameraSvg()}
                Export to Image
            </Button.Root>

            <TimeFormatSwitch />

            <Dialog.Close
                class={` hover:bg-neutral-300 rounded-md transition-colors duration-200 cursor-pointer`}
            >
                {@render xSvg()}
            </Dialog.Close>
        </div>
    </div>

    <div
        bind:this={calendarDiv}
        class={`h-[90%] bg-neutral-50 grid grid-cols-[60px_repeat(6,1fr)] mb-2`}
    >
        <div class={`border-b-2 border-neutral-800`}></div>
        {#each days as day}
            <div
                class={`text-center font-amulya font-bold py-2 border-b-2 border-l-2 border-neutral-800`}
            >
                {dayShortNames[day]}
            </div>
        {/each}

        <!-- time + day cols -->
        <div class={`relative`}>
            {#each timeLabels as label, i}
                {@const topPercent = (i / timeLabels.length) * 100}
                <div
                    class={`absolute right-2 text-xs text-neutral-600`}
                    style:top={`${topPercent}%`}
                >
                    {label}
                </div>
            {/each}
        </div>

        {#each days as day}
            <div class={`relative min-h-162.5 border-l-2 border-neutral-800`}>
                <!-- hour grid lines -->
                {#each timeLabels as _, i}
                    {@const topPercent = (i / timeLabels.length) * 100}
                    <div
                        class={`absolute w-full border-t border-neutral-300`}
                        style:top={`${topPercent}%`}
                    ></div>
                {/each}

                <!-- course blocks -->
                {#each courseBlocksByDay[day] as block}
                    <div
                        class={`absolute left-0.5 right-0.5 ${block.colorClass} border-l-4 rounded-r-sm px-1 py-0.5 overflow-hidden text-xs`}
                        style:top={`${block.top}%`}
                        style:height={`${block.height}%`}
                    >
                        <p class={`font-bold truncate`}>
                            {block.course.course_codes[0]}
                            -
                            {parseCourseComponent(block.course.component)}
                        </p>

                        <p>
                            {block.course.course_name}
                        </p>

                        <p class={`truncate text-neutral-600`}>
                            {formatTime(block.timeslot.start_time!)}
                            -
                            {formatTime(block.timeslot.end_time!)}
                            {#if block.timeslot.room}
                                , {block.timeslot.room}
                            {/if}
                        </p>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>

{#snippet xSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`h-6 aspect-square fill-none stroke-current stroke-2 lucide lucide-x-icon lucide-x`}
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
{/snippet}

{#snippet cameraSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`h-4.5 aspect-square fill-none stroke-current stroke-2 lucide lucide-camera-icon lucide-camera`}
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path
            d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"
        />
        <circle cx="12" cy="13" r="3" />
    </svg>
{/snippet}
