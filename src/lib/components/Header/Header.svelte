<script lang="ts">
    import { Button } from "bits-ui";
    import { fly } from "svelte/transition";
    import TimeFormatSwitch from "$lib/components/Header/TimeFormatSwitch.svelte";

    let displayScrollToTop: boolean = $state(false);
    $effect(() => {
        displayScrollToTop = window.screenY > 100;
    });
</script>

<svelte:window onscroll={() => (displayScrollToTop = window.scrollY > 100)} />

<header
    class={`h-16 md:w-[96ch] w-full bg-neutral-50 flex justify-between items-center p-4 mx-auto`}
>
    <nav>
        <h1 class={`font-amulya font-bold italic text-4xl`}>
            <Button.Root href={`/`}>slotify</Button.Root>
        </h1>

        {#if displayScrollToTop}
            <div
                transition:fly={{ y: "100%" }}
                class={`fixed bottom-4 right-4`}
            >
                <Button.Root
                    aria-label={`scroll to top`}
                    onclick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })}
                    class={`h-9 aspect-square bg-neutral-50 hover:bg-neutral-200 grid place-items-center border-2 border-neutral-800 rounded-full cursor-pointer transition-colors duration-200`}
                >
                    {@render upArrowSvg()}
                </Button.Root>
            </div>
        {/if}
    </nav>

    <TimeFormatSwitch />
</header>

{#snippet upArrowSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`h-6 aspect-square fill-none stroke-[1.5] stroke-current lucide lucide-arrow-up-icon lucide-arrow-up`}
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
    </svg>
{/snippet}
