<script lang="ts">
    import { setShowDisclaimer, ShowDisclaimer } from "$lib/stores/MiscStores";
    import { Button } from "bits-ui";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    let isMounted = $state(false);
    onMount(() => {
        isMounted = true;
    });
</script>

{#if isMounted}
    {#if $ShowDisclaimer}
        <div
            transition:fly={{ y: "100%" }}
            class={`z-40 fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] flex items-center justify-between px-2 py-1 text-xs bg-yellow-400 rounded-md`}
        >
            <p>
                This site uses data from the shared Excel sheet only. ERP
                changes won't show up here. Some courses don't have codes
                assigned yet; there's only so much I can do. Use at your own
                discretion. Accuracy isn't guaranteed.
            </p>

            <Button.Root
                onclick={() => setShowDisclaimer(false)}
                class={`cursor-pointer`}
            >
                {@render xSvg()}
                <p class={`sr-only`}>Close Warning</p>
            </Button.Root>
        </div>
    {/if}
{/if}

{#snippet xSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-[24px] aspect-square fill-none stroke-2 stroke-neutral-800 lucide lucide-x-icon lucide-x"
    >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
{/snippet}
