<script lang="ts">
    import { CourseEntriesStore } from "$lib/stores/TimetableStore";
    import type { CourseEntry } from "$lib/types/CourseEntry.type";
    import { Button, DropdownMenu } from "bits-ui";
    import RenderTimeSlots from "./RenderTimeSlots.svelte";
    import { ClashingCourseEntries } from "$lib/stores/ClashingEntriesStore";
    import { swapCourses } from "$lib/stores/SelectedEntriesStore";

    interface Props {
        id: CourseEntry["id"];
        section_variants: CourseEntry["section_variants"];
    }
    const { id, section_variants }: Props = $props();

    const parseCourseComponent = (c: CourseEntry["component"]): string => {
        const [type, number] = c;
        return `${type}${number}`;
    };

    const handleSwapEntry = (variantId: CourseEntry["id"]) => {
        swapCourses(id, variantId);
    };
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger
        aria-label={`swap component`}
        class={`h-[27.2px] aspect-square hover:bg-yellow-300 grid place-items-center border-2 border-neutral-800 rounded-md cursor-pointer transition-colors duration-200`}
    >
        {@render swapSvg()}
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
        <DropdownMenu.Content
            sideOffset={8}
            class={`w-[256px] bg-neutral-50 border-2 border-neutral-800 rounded-md`}
        >
            <DropdownMenu.Group>
                {#each section_variants as variantId, idx}
                    {@const variantCourseEntry =
                        $CourseEntriesStore.get(variantId)}
                    {#if variantCourseEntry}
                        {@const clashesWith =
                            $ClashingCourseEntries.get(variantId) ?? []}

                        <DropdownMenu.Item>
                            <Button.Root
                                onclick={() => handleSwapEntry(variantId)}
                                class={`relative h-full w-full hover:bg-neutral-200 flex flex-col p-2 items-start cursor-pointer transition-colors duration-200 ${idx === 0 ? "rounded-t-md" : idx === section_variants.length - 1 ? "rounded-b-md" : "rounded-none"}`}
                            >
                                <p>
                                    {variantCourseEntry.course_codes.join("/")}
                                    {" - "}
                                    {parseCourseComponent(
                                        variantCourseEntry.component,
                                    )}
                                </p>

                                <RenderTimeSlots
                                    timeSlots={variantCourseEntry.timeslots}
                                />

                                {#if clashesWith.length > 0}
                                    <div
                                        class={`absolute top-1/2 right-2 -translate-y-1/2`}
                                    >
                                        {@render warningSvg()}
                                    </div>
                                {/if}
                            </Button.Root>
                        </DropdownMenu.Item>
                        {#if idx < section_variants.length - 1}
                            <hr />
                        {/if}
                    {/if}
                {/each}
            </DropdownMenu.Group>
        </DropdownMenu.Content>
    </DropdownMenu.Portal>
</DropdownMenu.Root>

{#snippet swapSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`h-4.5 aspect-square fill-none stroke-current stroke-2 lucide lucide-arrow-left-right-icon lucide-arrow-left-right`}
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M8 3 4 7l4 4" />
        <path d="M4 7h16" />
        <path d="m16 21 4-4-4-4" />
        <path d="M20 17H4" />
    </svg>
{/snippet}

{#snippet warningSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`h-6 aspect-square fill-none stroke-2 stroke-current lucide lucide-triangle-alert-icon lucide-triangle-alert`}
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path
            d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
        />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
    </svg>
{/snippet}
