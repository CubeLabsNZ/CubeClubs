<script lang="ts">
    import Breadcrumb from '$lib/components/global/Breadcrumb.svelte';
    import Button from '$lib/components/global/Button.svelte';

    import type { PageData } from './$types';
    export let data: PageData;
</script>

<Breadcrumb paths={[
    {name: "Meetups", href: "/dashboard/meetups"},
    {name: data.meetup.name, href: `/dashboard/meetups/${data.meetup.id}/`},
    {name: "Edit Competitors", href: `/dashboard/meetups/${data.meetup.id}/edit/users`},
    {name: "Add Competitor", href: `/dashboard/meetups/${data.meetup.id}/edit/users/add`},
]} />

<div style:height="16px" />
