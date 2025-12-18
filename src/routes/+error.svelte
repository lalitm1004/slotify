<script lang="ts">
    import omoriPng from "$lib/assets/omori.png";
</script>

<main class={`min-h-[90dvh] grow grid place-items-center`}>
    <div class={`flex flex-col items-center gap-10`}>
        <img
            src={omoriPng}
            alt={`omori pixel art`}
            fetchpriority={`high`}
            height="128"
            width="128"
        />

        <div class={`relative text-lg`}>
            <div class={`p-0.5 border border-neutral-950`}>
                <div
                    class={`h-16 w-100 flex justify-start p-2 font-omori bg-neutral-950 text-neutral-50`}
                >
                    <p>404 (Waiting for something to happen?)</p>
                </div>
            </div>

            <div class={`absolute -top-12 p-0.5 border border-neutral-950`}>
                <div
                    class={`h-fit w-fit flex justify-start px-2 py-1 font-omori bg-neutral-950 text-neutral-50`}
                >
                    <p>OMORI</p>
                </div>
            </div>
        </div>
    </div>
</main>
