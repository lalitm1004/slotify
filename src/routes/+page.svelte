<script lang="ts">
    import CourseGallery from "$lib/components/CourseGallery.svelte";
    import SelectedCourseGallery from "$lib/components/SelectedCourseGallery.svelte";
</script>

<main class={`h-full w-full flex flex-grow gap-4 px-20 pb-4`}>
    <section class={`w-[75%]`}>
        <CourseGallery />
    </section>

    <div class={`w-[1px] border border-neutral-800`}></div>

    <section class={`w-[25%]`}>
        <SelectedCourseGallery />
    </section>
</main>

<svelte:head>
    <title>slotify</title>
    <meta
        name="description"
        content="Simplify looking for clashes with slotify. Simply select your core courses and let slotify crush your dreams of taking that UWE you've been eyeing for two semesters"
    />
</svelte:head>
