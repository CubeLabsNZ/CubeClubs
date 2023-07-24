<script lang="ts">
    import DetailPage from "$lib/components/DetailPage.svelte";
    import MeetupCard from "$lib/components/MeetupCard.svelte";
    import Button from "$lib/components/Button.svelte";

    import type { PageData } from './$types';

    export let data: PageData
</script>

<div style:height=16px></div>

<a href="/dashboard/meetups/new">
    <Button>
        <div style:display=flex style:align-items=center>
            <span class="material-symbols-outlined" style:color=var(--c-dg2)>add</span>
            <p> New Meetup </p>
        </div>
    </Button>
</a>



{#if data.draftCompetitions.length > 0}
    <h3 class="fsize-title2" style:font-weight=500 style:margin-bottom=4px style:margin-top=48px>Draft Meetups</h3>

    <div class="meetup-list">
        {#each data.draftCompetitions as meetup}
            <MeetupCard meetup={meetup} href={`/dashboard/meetups/${meetup.id}`}/>
        {/each}
    </div>
{/if}


<h3 class="fsize-title2" style:font-weight=500 style:margin-bottom=4px style:margin-top=48px>Published Meetups</h3>

<div class="meetup-list">
    {#each data.publishedCompetitions as meetup}
        <MeetupCard meetup={meetup} href={`/dashboard/meetups/${meetup.id}`}/>
    {/each}
</div>


<style>
    .meetup-list {
        display: flex;
        flex-direction: column;

        row-gap: 16px;
    }
</style>
