<script lang="ts">
	import "$lib/styles/app.css";
	import Header from "$lib/components/Header.svelte";
	import { setDevice } from "$lib/stores/DeviceStore";
	import { onMount } from "svelte";

	let { children } = $props();

	const handleDevice = () => {
		setDevice(
			window.matchMedia("(max-width: 767px").matches
				? "mobile"
				: "desktop",
		);
	};

	onMount(() => {
		handleDevice();
	});
</script>

<svelte:window onresize={() => handleDevice()} />

<Header />

{@render children()}

<div
	class={`desktop:hidden z-50 absolute top-0 left-0 h-dvh w-dvw bg-neutral-500/50 backdrop-blur-sm`}
>
	<div
		class={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] flex flex-col items-center justify-center gap-2 py-4 px-2 text-center bg-neutral-100 border-2 border-neutral-800 rounded-md`}
	>
		<p class={`font-amulya font-bold italic text-3xl`}>slotify</p>
		<p class={`tracking-tighter`}>
			Please use a desktop machine. Mobile displays are not currently
			supported.
		</p>
	</div>
</div>
