<script lang="ts">
    import { ArrowUp, ExternalLink } from "@lucide/svelte";
    import { Button } from "bits-ui";
    import TimeFormat from "$lib/components/TimeFormat.svelte";
    import { fly } from "svelte/transition";

    const shouldShowScrollTop = () => {
        return window.scrollY > 100;
    };

    let showScrollTop: boolean = $state(false);
    $effect(() => {
        showScrollTop = shouldShowScrollTop();
    });

    const scrollToTop = () => {
        window.scroll({ top: 0, behavior: "smooth" });
    };
</script>

<svelte:window onscroll={() => (showScrollTop = shouldShowScrollTop())} />

<header
    class={`h-[60px] md:w-[96ch] flex justify-between items-center mx-auto`}
>
    <nav>
        <h1
            class={`font-amulya font-bold italic text-3xl flex items-center gap-1.5`}
        >
            <Button.Root href={`/`}>slotify</Button.Root>
        </h1>

        {#if showScrollTop}
            <button
                transition:fly={{ y: "100%" }}
                aria-label={`scroll to top`}
                onclick={scrollToTop}
                class={`fixed bottom-4 right-4 h-[36px] aspect-square grid place-items-center hover:bg-neutral-300 border-2 border-neutral-800 rounded-full transition-colors duration-200 cursor-pointer`}
            >
                <ArrowUp />
            </button>
        {/if}
    </nav>

    <div class={`h-full flex items-center gap-4`}>
        <TimeFormat />

        <Button.Root
            class={`flex items-center gap-2 px-2 py-1 border-2 border-neutral-800 rounded-md`}
            href={`https://github.com/lalitm1004/slotify`}
            target={`_blank`}
            rel={`noopener noreferrer`}
        >
            GitHub

            <ExternalLink size={`20`} />
        </Button.Root>
    </div>
</header>
