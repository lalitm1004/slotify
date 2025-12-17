<script lang="ts">
    import CourseGallery from "$lib/components/Galleries/CourseGallery.svelte";
    import Filters from "$lib/components/Filters.svelte";
    import SelectedCourseGallery from "$lib/components/Galleries/SelectedCourseGallery.svelte";
</script>

<main class={`min-h-fit w-full flex gap-2 px-20 pb-4`}>
    <section class={`w-3/4 flex flex-col`}>
        <Filters />

        <div class={`h-px border border-neutral-800 m-2`}></div>

        <CourseGallery />
    </section>

    <div class={`w-px border border-neutral-800`}></div>

    <section class={`w-1/4`}>
        <SelectedCourseGallery />
    </section>
</main>
