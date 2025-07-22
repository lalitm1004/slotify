<script lang="ts">
    import { ExternalLink } from "@lucide/svelte";
    import { Button } from "bits-ui";
    import TimeFormat from "./TimeFormat.svelte";
</script>

<header class={`h-[60px] w-[96ch] flex justify-between items-center mx-auto`}>
    <nav>
        <h1 class={`font-amulya font-bold italic text-3xl`}>
            <Button.Root href={`/`}>slotify</Button.Root>
        </h1>
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
