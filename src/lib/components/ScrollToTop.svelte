<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    let display: boolean = $state(false);

    const shouldDisplay = () => {
        return window.scrollY > 100;
    };

    onMount(() => (display = shouldDisplay()));

    const handleClick = () => {
        window.scroll({ top: 0, behavior: "smooth" });
    };
</script>

<svelte:window onscroll={() => (display = shouldDisplay())} />

{#if display}
    <button
        transition:fly={{ y: "100%" }}
        aria-label={`Scroll to top`}
        onclick={handleClick}
        class={`z-50 fixed bottom-4 right-4 h-[36px] aspect-square grid place-items-center bg-neutral-200 hover:bg-neutral-300 border-2 border-neutral-800 rounded-full cursor-pointer`}
    >
        <p class={`sr-only`}>Scroll to top</p>

        {@render upArrowSvg()}
    </button>
{/if}

{#snippet upArrowSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-[24px] aspect-square fill-none stroke-[1.5] stroke-current lucide lucide-arrow-up-icon lucide-arrow-up"
    >
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
    </svg>
{/snippet}
