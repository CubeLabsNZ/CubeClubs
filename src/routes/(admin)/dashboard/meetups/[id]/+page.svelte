<script lang="ts">
    import Button from "$lib/components/global/Button.svelte";
    import type { PageData } from "./$types"

    import { page } from "$app/stores";

    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";

    export let data: PageData;

    let isPublished = data.meetup.isPublished
    let meetupFetch: Promise<Response> | undefined

    function togglePublish() {
        // TODO: check relative path if it's ok later on/in prod
        const action = isPublished? "unpublish" : "publish";
        meetupFetch = fetch(`./${data.meetup.id}/edit/${action}`, {
            method: "POST"
        });
        meetupFetch.then(res => {
            if (res.ok) {
                console.log("HERE")
                isPublished = !isPublished
            }
        })
    }

</script>

<Breadcrumb paths={[
    {name: "Meetups", href: "/dashboard/meetups"},
    {name: data.meetup.name, href: `/dashboard/meetups/${data.meetup.id}`}
]} />

<div class="button-bar">
    <!-- <span class="material-symbols-outlined">done</span> -->
    <!-- TODO: disable when loading -->
    <button on:click={togglePublish}>
        <Button>
            {#await meetupFetch}
                Loading...
            {:then response}
                {#if response == undefined || response.ok}
                    {isPublished ? "Revert to Draft" : "Publish Meetup"}
                {:else}
                    Error :( <!-- TODO: figure out how to move make it throw when not ok -->
                {/if}
            {/await}
        </Button>
    </button>
        

    {#if isPublished}
        <a href={$page.url + "/edit/results"}>
            <Button>
                Enter Results
            </Button>
        </a>
    {/if}

    <hr>

    <a href={$page.url + "/edit"}>
        <Button>
            Edit Details
        </Button>
    </a>
    

    <a href={$page.url + "/edit/schedule"}>
        <Button>
            Edit Schedule
        </Button>
    </a>
    

    <hr>

    <Button>
        Delete Meetup
    </Button>
</div>

<h3 class="fsize-title2" style:font-weight=500 style:margin-top=32px style:margin-bottom=16px>Meetup Info</h3>

<!--  TODO: again all duplicated code -->
<div class="info-grid">
    <div class="info-left">
        <div class="label-group">
            <p class="label">Date</p>
            <p>
                {data.meetup.date.toLocaleDateString("en-NZ", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </p>
        </div>

        <div class="label-group">
            <p class="label">Venue</p>
            <p>{data.meetup.venue}</p>
        </div>

        <div class="label-group">
            <p class="label">Location</p>
            <p>{data.meetup.location}</p>
        </div>

        <div class="label-group">
            <p class="label">Organisers</p>
            <ul>
                {#each data.meetup.organisers as { name }}
                    <li>{name}</li>
                {/each}
            </ul>
        </div>

        <div class="label-group">
            <p class="label">Competitor Limit</p>
            <p>{data.meetup.competitorLimit}</p>
        </div>
    </div>

    <div class="info-right">
        <div class="label-group">
            <p class="label">Meetup Description</p>
            <p>{data.meetup.description}</p>
        </div>
    </div>
</div>



<h3 class="fsize-title2" style:font-weight=500 style:margin-top=48px style:margin-bottom=16px>Schedule</h3>


<style>
    hr {
        padding: 0;
        margin: 0;

        margin-top: auto;
        margin-bottom: auto;

        width: 1.5px;
        height: 24px;

        border: none;
        border-right: 1px solid var(--c-lg1);
    }

    .button-bar {
        display: flex;
        flex-direction: row;
        column-gap: 16px;

        margin-top: 8px;
    }


    /* TODO: again all duplicated code */
    /* INFO: info tab */
    .info-grid {
        display: grid;
        grid-auto-columns: 1fr;
        grid-auto-flow: column;

        column-gap: 16px;
    }

    .info-left {
        grid-column: 1;
    }

    .info-right {
        grid-column: 2;
    }

    .info-left,
    .info-right {
        display: flex;
        flex-direction: column;
        row-gap: 24px;
    }
</style>
