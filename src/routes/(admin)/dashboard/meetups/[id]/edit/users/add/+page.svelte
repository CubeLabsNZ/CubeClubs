<script lang="ts">
    import Breadcrumb from '$lib/components/global/Breadcrumb.svelte';
    import MultiSelect, { LabelType } from '$lib/components/global/MultiSelect.svelte';
    import Form from '$lib/components/global/Form.svelte';

    import puzzles from "$lib/data/puzzles";

    let selectedEvents = new Set();

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


<Form name="Add Competitor" fillWidth={false}>
    <label class="form-label">
        Add Events

        <MultiSelect 
            bind:selectedIndices={selectedEvents} 
            padding={4} 
            fixedHeight={false} 
            labels={ Object.values(puzzles).map(p => ({type: LabelType.Image, data: p.icon})) } />
    </label>
</Form>

