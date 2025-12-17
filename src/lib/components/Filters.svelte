<script lang="ts">
    import { Checkbox, Label } from "bits-ui";

    let strictlyOpenAsUWE: boolean = $state(false);
</script>

<form>
    <div>
        <Label.Root>Only show courses open as UWE:</Label.Root>
        <Checkbox.Root bind:checked={strictlyOpenAsUWE}>
            {#snippet children({ checked })}
                {#if checked}
                    {@render checkSvg()}
                {/if}
            {/snippet}
        </Checkbox.Root>
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
