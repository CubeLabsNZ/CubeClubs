<script lang="ts">
    import DetailPage from "$lib/components/DetailPage.svelte";
    import MeetupCard from "$lib/components/MeetupCard.svelte";
    import Button, { ButtonType } from "$lib/components/Button.svelte";

    import { goto } from "$app/navigation";


    import type { PageData } from './$types';

    export let data: PageData
</script>

<DetailPage heading="Manage Meetups" top={64}>
    <div style:height=16px></div>

    <Button type={ButtonType.Bordered} perform={() => {goto("/dashboard/meetups/new")}}>
        <div style:display=flex style:align-items=center>
            <span class="material-symbols-outlined" style:color=var(--c-dg2)>add</span>
            <p> New Meetup </p>
        </div>
    </Button>


    <h3 class="fsize-title2" style:font-weight=500 style:margin-bottom=4px style:margin-top=48px>Draft Meetups</h3>
        {#each data.draftCompetitions as meetup}
            <MeetupCard meetup={meetup}/>
        {/each}
    <div class="meetup-list">
    </div>

    <h3 class="fsize-title2" style:font-weight=500 style:margin-bottom=4px style:margin-top=48px>Published Meetups</h3>
        {#each data.publishedCompetitions as meetup}
            <MeetupCard meetup={meetup}/>
        {/each}
    <div class="meetup-list">
    </div>
</DetailPage>


<style>
    .meetup-list {
        display: flex;
        flex-direction: column;

        row-gap: 16px;
    }
</style>
