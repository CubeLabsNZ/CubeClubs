<script lang="ts">
    import PageContent from "$lib/components/global/PageContent.svelte";

    export let data;
</script>


<svelte:head>
    <title>{data.meetup.name}</title>
</svelte:head>

<PageContent heading={data.meetup.name} subheading={data.meetup.club.name}>
    <slot/>
</PageContent>
