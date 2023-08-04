<script lang="ts">
    import PageContent from "$lib/components/global/PageContent.svelte";
    import MeetupBar from "$lib/components/global/card/MeetupBar.svelte";


    import type { PageData } from './$types';

    export let data: PageData
</script>


<svelte:head>
    <title>Meetups</title>
</svelte:head>


<PageContent
    heading="Meetups"
    subheading="We welcome cubers of all skill levels! Most of our meetups are casual get-togethers, but will be in the format of WCA competitions.">

    <div class="container">
        {#if data.ongoingMeetups.length > 0}
            <h3 class="fsize-title2">Ongoing Meetups</h3>

            <div class="meetup-list">
                {#each data.ongoingMeetups as meetup}
                    <MeetupBar meetup={meetup} current href={`/meetups/${meetup.id}`}/>
                {/each}
            </div>
        {/if}

        <h3 class="fsize-title2">Upcoming Meetups</h3>
        {#if data.upcomingMeetups.length > 0}
            <div class="meetup-list">
                {#each data.upcomingMeetups as meetup}
                    <MeetupBar meetup={meetup} current href={`/meetups/${meetup.id}`}/>
                {/each}
            </div>
        {:else}
            <p class="fsize-body" style:color=var(--c-g)> We have no upcoming meetups planned. Check back later! </p>
        {/if}

        <h3 class="fsize-title2">Past Meetups</h3>
        <div class="meetup-list">
            {#each data.pastMeetups as meetup}
                <MeetupBar meetup={meetup} href={`/meetups/${meetup.id}`}/>
            {/each}
        </div>
    </div>
</PageContent>


<style>
    .container h3 {
        margin-bottom: 4px;
        font-weight: 500;
    }

    .container h3:not(:first-child) {
        padding-top: 48px;
    }

    .meetup-list {
        display: flex;
        flex-direction: column;

        row-gap: 16px;
    }

</style>
