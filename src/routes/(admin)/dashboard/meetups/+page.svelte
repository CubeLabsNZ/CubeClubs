<script lang="ts">
    import MeetupBar from "$lib/components/global/card/MeetupBar.svelte";
    import Button from "$lib/components/global/Button.svelte";

    import type { PageData } from './$types';

    import { Plus } from "lucide-svelte";

    export let data: PageData
</script>

<div style:height=16px></div>

<a href="/dashboard/meetups/new">
    <Button>
        <div class="button-inner">
            <Plus size="16" />
            <p> New Meetup </p>
        </div>
    </Button>
</a>


{#if data.draftMeetups.length > 0}
    <h3 class="fsize-title2" style:font-weight=500 style:margin-bottom=4px style:margin-top=48px>Draft Meetups</h3>

    <div class="meetup-list">
        {#each data.draftMeetups as meetup}
            <MeetupBar meetup={meetup} href={`/dashboard/meetups/${meetup.id}`}/>
        {/each}
    </div>
{/if}


<h3 class="fsize-title2" style:font-weight=500 style:margin-bottom=4px style:margin-top=48px>Published Meetups</h3>

<div class="meetup-list">
    {#each data.publishedMeetups as meetup}
        <MeetupBar meetup={meetup} href={`/dashboard/meetups/${meetup.id}`}/>
    {/each}
</div>


<style>
    .meetup-list {
        display: flex;
        flex-direction: column;

        row-gap: 16px;
    }

    .button-inner {
        display: flex;
        align-items: center;
        column-gap: 8px;
    }

    .button-inner span {
        font-size: 20px;
    }
</style>
