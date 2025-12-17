<script lang="ts">
	import "$lib/styles/app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { onMount } from "svelte";
	import cleanupLocalStorage from "$lib/utils/cleanupLocalStorage";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";

	let { children } = $props();

	onMount(() => {
		cleanupLocalStorage();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<title>slotify</title>
	<meta
		name="description"
		content="Simplify looking for clashes with slotify. Simply select your core courses and let slotify crush your dreams of taking that UWE you've been eyeing for two semesters"
	/>
</svelte:head>

<div>
	<Header />

	{@render children()}

	<Footer />
</div>
