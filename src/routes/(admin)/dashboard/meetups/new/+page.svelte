<script lang="ts">
    import MeetupForm from '$lib/components/dashboard/MeetupForm.svelte';

    import Breadcrumb from '$lib/components/global/Breadcrumb.svelte';

    import type { PageData } from './$types';
    export let data: PageData;
    let addedOrganisers, organisersError;

    function handleForm({ formData, cancel }) {
        if (addedOrganisers.length < 1) { cancel(); organisersError = true }
        formData.set("organisers", addedOrganisers.reduce((acc, cur) => `${acc} ${cur.id}`, ""));
    }
</script>

<Breadcrumb paths={[
    {name: "Meetups", href: "/dashboard/meetups"},
    {name: "New Meetup", href: "/dashboard/meetups/new"}
]} />

<div style:height="16px" />

<MeetupForm name="Create Meetup" {data} {handleForm} bind:addedOrganisers bind:organisersError />
