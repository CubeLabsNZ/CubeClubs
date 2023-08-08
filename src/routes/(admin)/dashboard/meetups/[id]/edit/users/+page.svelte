<script lang="ts">
    import Breadcrumb from '$lib/components/global/Breadcrumb.svelte';
    import Button from '$lib/components/global/Button.svelte';

    import type { PageData } from './$types';
    export let data: PageData;
</script>

<Breadcrumb paths={[
    {name: "Meetups", href: "/dashboard/meetups"},
    {name: data.meetup.name, href: `/dashboard/meetups/${data.meetup.id}/`},
    {name: "Edit Competitors", href: `/dashboard/meetups/${data.meetup.id}/edit/users`}
]} />

<div style:height="16px" />

<a href="/dashboard/meetups/{data.meetup.id}/edit/users/add">
    <Button>
        <div class="button-inner">
            <span class="material-symbols-outlined">add</span>
            <p> Add Competitor </p>
        </div>
    </Button>
</a>


<h3 class="fsize-title2" style:font-weight=500 style:margin-top=32px style:margin-bottom=16px>Registered Competitors</h3>

<style>
    .button-inner {
        display: flex;
        align-items: center;
        column-gap: 8px;
    }

    .button-inner span {
        font-size: 20px;
    }
</style>
