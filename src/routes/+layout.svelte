<script lang="ts">
	import "$lib/styles/app.css";
	import Header from "$lib/components/Header.svelte";
	import { setDevice } from "$lib/stores/DeviceStore";
	import { onMount } from "svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Disclaimer from "$lib/components/Disclaimer.svelte";
	import cleanupLocalStorage from "$lib/utils/cleanupLocalStorage";

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
		cleanupLocalStorage();
	});
</script>

<svelte:window onresize={() => handleDevice()} />

<div class={`mobile:hidden min-h-dvh w-dvw flex flex-col overflow-x-hidden`}>
	<Header />

	{@render children()}

	<Disclaimer />

	<Footer />
</div>

<div
	class={`desktop:hidden z-50 absolute top-0 left-0 h-dvh w-dvw bg-neutral-200`}
>
	<div
		class={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] flex flex-col items-center justify-center gap-2 py-4 px-2 text-center border-2 border-neutral-800 rounded-md`}
	>
		<h1 class={`font-amulya font-bold italic text-3xl`}>slotify</h1>
		<p class={`tracking-tighter`}>
			Please use a desktop machine. Mobile displays are not currently
			supported.
		</p>
	</div>
</div>
