<script lang="ts">
    import Breadcrumb from '$lib/components/global/Breadcrumb.svelte';
    import MultiSelect, { LabelType } from '$lib/components/global/MultiSelect.svelte';
    import Form from '$lib/components/global/Form.svelte';

    import puzzles from "$lib/data/puzzles";

    export let data: PageData;

    let selectedEvents = new Set(data.registered_events.map(e => Object.keys(puzzles).findIndex(p => p === e)));

    import type { PageData } from './$types';

    let error = "";
</script>

<Breadcrumb paths={[
    {name: "Meetups", href: "/dashboard/meetups"},
    {name: data.meetup.name, href: `/dashboard/meetups/${data.meetup.id}/`},
    {name: "Edit Competitors", href: `/dashboard/meetups/${data.meetup.id}/edit/users`},
    {name: data.user.name, href: `/dashboard/meetups/${data.meetup.id}/edit/users/add`},
]} />

<div style:height="16px" />

{@debug selectedEvents}

<Form 
    name="Edit Competitor" 
    fillWidth={false}
    run={({ formData, cancel }) => {
        const eventsArray = [...selectedEvents];

        error = "";

        if (eventsArray.length === 0) {
            cancel();
            error = "events";
        }

        if (error === "") {
            formData.set("events", eventsArray.map(i => Object.keys(puzzles)[i]).join(":"))
        }
    }}>


    <label class="form-label">
        Add Events

        <MultiSelect 
            bind:selectedIndices={selectedEvents} 
            padding={4} 
            fixedHeight={false} 
            labels={ Object.entries(puzzles).filter(p => data.puzzles.includes(p[0])).map(p => ({type: LabelType.Image, data: p[1].icon})) } />

        {#if error === "events"}
            <p class="fsize-subhead" style:color=var(--c-red)> please select atleast one event </p>
        {/if}
    </label>
</Form>

