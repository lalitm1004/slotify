<script lang="ts">
	import Header from "$lib/components/Header.svelte";
	import "$lib/styles/app.css";

	let { children } = $props();
</script>

<Header />

{@render children()}
