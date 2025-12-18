<script lang="ts">
    import { FilterStore } from "$lib/stores/FilterStore";
    import {
        ComponentTypeEnum,
        type ComponentType,
    } from "$lib/types/CourseEntry.type";
    import { Checkbox, Label, ToggleGroup } from "bits-ui";

    let components: ComponentType[] = $state(ComponentTypeEnum.options);
    let uweStrictMode: boolean = $state(false);
    let showClashing: boolean = $state(true);
    let courseCodeQuery: string = $state("");
    let courseNameQuery: string = $state("");
    let studentGroupQuery: string = $state("");

    $effect(() => {
        FilterStore.update((f) => ({ ...f, components: new Set(components) }));
    });

    $effect(() => {
        FilterStore.update((f) => ({ ...f, showClashing }));
    });

    $effect(() => {
        FilterStore.update((f) => ({ ...f, uweStrictMode }));
    });

    $effect(() => {
        FilterStore.update((f) => ({ ...f, courseCodeQuery }));
    });

    $effect(() => {
        FilterStore.update((f) => ({ ...f, courseNameQuery }));
    });

    $effect(() => {
        FilterStore.update((f) => ({ ...f, studentGroupQuery }));
    });
</script>

<form class={`flex flex-col gap-2 px-4`}>
    <div class={`flex gap-2`}>
        <div class={`flex items-center gap-1`}>
            <Label.Root id={`uwe-strict-mode-label`} for={`uwe-strict-mode`}>
                Only show courses open as UWE:
            </Label.Root>

            <Checkbox.Root
                bind:checked={uweStrictMode}
                id={`uwe-strict-mode`}
                aria-labelledby={`uwe-strict-mode-label`}
                class={`h-6 aspect-square grid place-items-center border-2 border-neutral-800 rounded-md cursor-pointer`}
            >
                {#snippet children({ checked })}
                    {#if checked}
                        {@render checkSvg()}
                    {/if}
                {/snippet}
            </Checkbox.Root>
        </div>

        <div class={`flex items-center gap-1`}>
            <Label.Root id={`show-clashing-label`} for={`show-clashing`}>
                Display Clashing Courses:
            </Label.Root>

            <Checkbox.Root
                bind:checked={showClashing}
                id={`show-clashing`}
                aria-labelledby={`show-clashing-label`}
                class={`h-6 aspect-square grid place-items-center border-2 border-neutral-800 rounded-md cursor-pointer`}
            >
                {#snippet children({ checked })}
                    {#if checked}
                        {@render checkSvg()}
                    {/if}
                {/snippet}
            </Checkbox.Root>
        </div>

        <div class={`flex items-center gap-1 `}>
            <Label.Root>Display Components:</Label.Root>

            <ToggleGroup.Root
                bind:value={components}
                id={`components`}
                type="multiple"
                class={`w-fit text-sm font-medium flex gap-1 rounded-md`}
            >
                {@const style = `h-6 aspect-square border-2 border-neutral-800 data-[state=on]:bg-green-400 data-[state=off]:bg-red-400 rounded-md cursor-pointer transition-colors duration-200`}

                <ToggleGroup.Item
                    aria-label={`toggle show lectures`}
                    value={"LEC"}
                    class={`${style}`}
                >
                    L
                </ToggleGroup.Item>

                <ToggleGroup.Item
                    aria-label={`toggle show lectures`}
                    value={"TUT"}
                    class={`${style}`}
                >
                    T
                </ToggleGroup.Item>

                <ToggleGroup.Item
                    aria-label={`toggle show lectures`}
                    value={"PRAC"}
                    class={`${style}`}
                >
                    P
                </ToggleGroup.Item>
            </ToggleGroup.Root>
        </div>
    </div>

    <div class={`w-full flex gap-4`}>
        <div class={`flex gap-1`}>
            <Label.Root id={`course-code-label`} for={`course-code`}>
                Course Code:
            </Label.Root>

            <input
                bind:value={courseCodeQuery}
                id={`course-code`}
                aria-labelledby={`course-code-label`}
                placeholder={`CSD334`}
                class={`w-[9ch] px-2 border-2 border-neutral-800 rounded-md`}
            />
        </div>

        <div class={`flex grow gap-1`}>
            <Label.Root id={`course-name-label`} for={`course-name`}>
                Course Name:
            </Label.Root>

            <input
                bind:value={courseNameQuery}
                id={`course-name`}
                aria-labelledby={`course-name-label`}
                placeholder={`Theory of Computation`}
                class={`grow px-2 border-2 border-neutral-800 rounded-md`}
            />
        </div>

        <div class={`flex gap-1`}>
            <Label.Root id={`student-group-label`} for={`student-group`}>
                Student Group:
            </Label.Root>

            <input
                bind:value={studentGroupQuery}
                id={`student-group`}
                aria-labelledby={`student-group-label`}
                placeholder={`CSD3YR`}
                class={`w-[15ch] px-2 border-2 border-neutral-800 rounded-md`}
            />
        </div>
    </div>
</form>

{#snippet checkSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`h-4.5 aspect-square fill-none stroke-2 stroke-current lucide lucide-check-icon lucide-check`}
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M20 6 9 17l-5-5" />
    </svg>
{/snippet}
