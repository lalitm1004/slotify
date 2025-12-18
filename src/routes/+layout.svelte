<script lang="ts">
	import "$lib/styles/app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { onMount } from "svelte";
	import cleanupLocalStorage from "$lib/utils/cleanupLocalStorage";
	import Header from "$lib/components/Header/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { setDevice } from "$lib/stores/MiscStores";

	let { children } = $props();

	const handleDevice = () => {
		setDevice(
			window.matchMedia("(max-width: 767px").matches
				? "mobile"
				: "desktop",
		);
	};

	onMount(() => {
		cleanupLocalStorage();
		handleDevice();
	});
</script>

<svelte:window onresize={() => handleDevice()} />

<svelte:head>
	<link rel="icon" href={favicon} />

	<title>slotify</title>
	<meta
		name="description"
		content="Simplify looking for clashes with slotify. Simply select your core courses and let slotify crush your dreams of taking that UWE you've been eyeing for two semesters"
	/>
</svelte:head>

<div class={`mobile:hidden`}>
	<Header />

	{@render children()}

	<Footer />
</div>

<div class={`desktop:hidden z-50 absolute top-0 left-0 h-dvh w-dvw`}>
	<div
		class={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 flex flex-col items-center justify-center gap-2 py-4 px-2 text-center border-2 border-neutral-800 rounded-md`}
	>
		<h1 class={`font-amulya font-bold italic text-3xl`}>slotify</h1>
		<div class={`tracking-tighter`}>
			<p>Please use a desktop machine</p>
			<p>I lowkuinely cannot be bothered to make a responsive website</p>

			<p>Send PR if you want it that bad</p>
		</div>
	</div>
</div>
