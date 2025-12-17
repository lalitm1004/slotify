<script lang="ts">
    import { Dialog } from "bits-ui";
    import { fade, fly } from "svelte/transition";
    import CalendarPane from "$lib/components/Calendar/CalendarPane.svelte";

    interface Props {
        disabled: boolean;
    }
    const { disabled }: Props = $props();
</script>

<Dialog.Root>
    <Dialog.Trigger
        {disabled}
        data-disabled={disabled}
        class={`flex items-center gap-1 px-2 py-1 text-sm data-[disabled=true]:bg-neutral-300 data-[disabled=true]:text-neutral-500 data-[disabled=true]:border-neutral-400 data-[disabled=false]:hover:bg-neutral-300 border-2 border-neutral-800 rounded-md data-[disabled=false]:cursor-pointer transition-colors duration-200`}
    >
        Calendar View
        {@render calendarSvg()}
    </Dialog.Trigger>

    <Dialog.Portal>
        <Dialog.Overlay
            forceMount
            class={`z-30 fixed inset-0 h-dvh w-dvw bg-black/80`}
        >
            {#snippet child({ props, open })}
                {#if open}
                    <div {...props} transition:fade={{ duration: 200 }}></div>
                {/if}
            {/snippet}
        </Dialog.Overlay>

        <Dialog.Content
            class={`z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 `}
            forceMount
        >
            {#snippet child({ props, open })}
                {#if open}
                    <div
                        {...props}
                        transition:fly={{ y: "100%", duration: 200 }}
                    >
                        <CalendarPane />
                    </div>
                {/if}
            {/snippet}
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>

{#snippet calendarSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`h-4.5 aspect-square fill-none stroke-current stroke-2 lucide lucide-calendar-icon lucide-calendar`}
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
    </svg>
{/snippet}
