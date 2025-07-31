<script lang="ts">
    import { TimeFormatStore, setTimeFormat } from "$lib/stores/MiscStores";
    import { Label, Switch } from "bits-ui";

    let checked = $derived($TimeFormatStore === "12H");

    const onCheckedChange = (newChecked: boolean) => {
        checked = newChecked;
        setTimeFormat(newChecked ? "12H" : "24H");
    };
</script>

<div class={`flex items-center gap-1    `}>
    <Label.Root class={`sr-only`}>Switch Time Format</Label.Root>

    <p>24H</p>
    <Switch.Root
        id="use-12-h"
        name="Time format switch"
        {checked}
        {onCheckedChange}
        class={`relative h-6 w-12 inline-flex items-center rounded-full border-2 border-neutral-950  bg-transparent cursor-pointer`}
    >
        <Switch.Thumb
            class={`h-4 inline-block aspect-square transform rounded-full bg-neutral-950 shadow-lg ring-0 transition-transform duration-200 ease-in-out data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1`}
        />
    </Switch.Root>
    <p>12H</p>
</div>
