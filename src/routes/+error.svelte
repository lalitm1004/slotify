<main class={`flex-grow grid place-items-center`}>
    <div class={`flex flex-col items-center gap-10`}>
        <img
            src={`/images/omori.png`}
            alt={`omori pixel art`}
            fetchpriority={`high`}
            height="128"
            width="128"
        />

        <div class={`relative text-lg`}>
            <div class={`p-0.5 border border-neutral-950`}>
                <div
                    class={`h-[64px] w-[400px] flex justify-start p-2 font-omori bg-neutral-950 text-neutral-50`}
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

<svelte:head>
    <title>slotify | 404</title>
    <meta name="description" content="404 (Waiting for something to happen?)" />
</svelte:head>
