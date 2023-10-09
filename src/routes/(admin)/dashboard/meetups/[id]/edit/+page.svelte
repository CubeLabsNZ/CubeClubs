<script lang="ts">
    import MeetupForm from '$lib/components/dashboard/MeetupForm.svelte';

    import Breadcrumb from '$lib/components/global/Breadcrumb.svelte';

    import type { PageData } from './$types';
    export let data: PageData;
    let addedOrganisers = data.meetup.organisers.flatMap(x => {
        let u = data.organisers.find(y => y.id == x.user.id)
        return u? [{name: u.name, id: u.id}] : []
    })
    let organisersError;

    function handleForm({ formData, cancel }) {
        if (addedOrganisers.length < 1) { cancel(); organisersError = true }
        formData.set("organisers", addedOrganisers.reduce((acc, cur) => `${acc} ${cur.id}`, ""));
    }
</script>

<Breadcrumb paths={[
    {name: "Meetups", href: "/dashboard/meetups"},
    {name: data.meetup.name, href: `/dashboard/meetups/${data.meetup.id}/`},
    {name: "Edit Details", href: `/dashboard/meetups/${data.meetup.id}/edit`}
]} />

<div style:height="16px" />

<MeetupForm name="Save Changes" {data} {handleForm} bind:addedOrganisers bind:organisersError />
