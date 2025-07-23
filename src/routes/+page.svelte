<script lang="ts">
    import CourseGallery from "$lib/components/CourseGallery.svelte";
    import SelectedCourseGallery from "$lib/components/SelectedCourseGallery.svelte";
</script>

<main class={`mobile:hidden min-h-dvh w-dvw px-20 flex pb-20`}>
    <section class={`gallery w-[70%]`}>
        <CourseGallery />
    </section>

    <div class={`w-[1px] ml-4 border border-neutral-800`}></div>

    <section class={`selected-courses w-[30%]`}>
        <SelectedCourseGallery />
    </section>
</main>

<svelte:head>
    <title>slotify</title>
</svelte:head>
