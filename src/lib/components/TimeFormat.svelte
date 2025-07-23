<script lang="ts">
    import { setFormatTo12H, Use12HFormat } from "$lib/stores/MiscStores";
    import { Label, Switch } from "bits-ui";
    import { onMount } from "svelte";

    let checked = $derived($Use12HFormat ?? false);

    const onCheckedChange = (newChecked: boolean) => {
        checked = newChecked;
        setFormatTo12H(newChecked);
    };

    let isLoaded = $state(false);
    onMount(() => {
        isLoaded = true;
    });
</script>

{#if isLoaded}
    <div class={`flex items-center gap-1    `}>
        <Label.Root class={`sr-only`}>Switch Time Format</Label.Root>

        <p>24H</p>
        <Switch.Root
            id="use-12-h"
            name="Time format switch"
            {checked}
            {onCheckedChange}
            class={`relative h-6 w-12 inline-flex items-center rounded-full border-2 border-neutral-800  bg-transparent cursor-pointer`}
        >
            <Switch.Thumb
                class={`h-4 inline-block aspect-square transform rounded-full bg-neutral-950 shadow-lg ring-0 transition-transform duration-200 ease-in-out data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1`}
            />
        </Switch.Root>
        <p>12H</p>
    </div>
{/if}
