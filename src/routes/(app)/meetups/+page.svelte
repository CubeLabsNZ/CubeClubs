<script lang="ts">
    import DetailPage from "$lib/components/DetailPage.svelte";
    import MeetupCard from "$lib/components/MeetupCard.svelte";


    import type { PageData } from './$types';

    export let data: PageData
</script>


<svelte:head>
    <title>Meetups</title>
</svelte:head>


<DetailPage
    heading="Meetups"
    subheading="We welcome cubers of all skill levels! Most of our meetups are casual get-togethers, but will be in the format of WCA competitions.">

    <h3 class="fsize-title2" style:font-weight=500 style:margin-bottom=4px>Ongoing Meetups</h3>

    <div class="meetup-list">
        {#each data.ongoingMeetups as meetup}
            <MeetupCard meetup={meetup} current/>
        {/each}
    </div>

    <h3 class="fsize-title2" style:font-weight=500 style:margin-bottom=4px style:margin-top=48px>Upcoming Meetups</h3>
    <div class="meetup-list">
        {#each data.upcomingMeetups as meetup}
            <MeetupCard meetup={meetup}/>
        {/each}
    </div>

    <h3 class="fsize-title2" style:font-weight=500 style:margin-bottom=4px style:margin-top=48px>Past Meetups</h3>
    <div class="meetup-list">
        {#each data.pastMeetups as meetup}
            <MeetupCard meetup={meetup}/>
        {/each}
    </div>
</DetailPage>


<style>
    .meetup-list {
        display: flex;
        flex-direction: column;

        row-gap: 16px;
    }

</style>
