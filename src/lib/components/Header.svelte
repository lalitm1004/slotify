<script lang="ts">
    import { Button } from "bits-ui";
    import TimeFormatSwitch from "$lib/components/TimeFormatSwitch.svelte";
    import ScrollToTop from "./ScrollToTop.svelte";
</script>

<header
    class={`h-[60px] md:w-[96ch] flex justify-between items-center mx-auto`}
>
    <nav class={`h-full flex items-center`}>
        <h1
            class={`font-amulya font-bold italic text-4xl flex items-center gap-1.5`}
        >
            <Button.Root href={`/`}>slotify</Button.Root>
        </h1>

        <ScrollToTop />
    </nav>

    <TimeFormatSwitch />
</header>
