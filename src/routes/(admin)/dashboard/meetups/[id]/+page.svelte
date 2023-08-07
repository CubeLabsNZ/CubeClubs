<script lang="ts">
    import { goto } from "$app/navigation";

    import Snackbar from "$lib/components/global/Snackbar.svelte";
    import Button from "$lib/components/global/Button.svelte";
    import type { PageData } from "./$types"

    import { page } from "$app/stores";

    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";

    export let data: PageData;

    let isPublished = data.meetup.isPublished
    let meetupFetch: Promise<Response> | undefined

    let showPublishMessage = false;

    function togglePublish() {
        showPublishMessage = true;
        // TODO: check relative path if it's ok later on/in prod
        const action = isPublished? "unpublish" : "publish";
        meetupFetch = fetch(`./${data.meetup.id}/edit/${action}`, {
            method: "POST"
        });
        meetupFetch.then(res => {
            if (res.ok) {
                isPublished = !isPublished
            }
        })

        setTimeout(() => { showPublishMessage = false }, 5000);
    }

    function deleteMeetup() {
        meetupFetch = fetch(`./${data.meetup.id}/edit/delete`, {
            method: "POST"
        });
        meetupFetch.then(res => {
            if (res.ok) {
                goto("/dashboard/meetups")
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
                <div class="button-inner">
                    <span class="material-symbols-outlined"> pin </span>
                    <p> Enter Results </p>
                </div>
            </Button>
        </a>
    {/if}

    <hr>

    <a href={$page.url + "/edit"}>
        <Button>
            <div class="button-inner">
                <span class="material-symbols-outlined"> edit </span>
                <p> Edit Details </p>
            </div>
        </Button>
    </a>


    <a href={$page.url + "/edit/schedule"}>
        <Button>
            <div class="button-inner">
                <span class="material-symbols-outlined"> edit_calendar </span>
                <p> Edit Schedule </p>
            </div>
        </Button>
    </a>


    <a href={$page.url + "/edit/users"}>
        <Button>
            <div class="button-inner">
                <span class="material-symbols-outlined"> manage_accounts </span>
                <p> Edit Competitors </p>
            </div>
        </Button>
    </a>


    <hr>

    <button on:click={() => {
        if (confirm("Are you sure you want to delete this meetup?")) {
            deleteMeetup();
        }}}>
        <Button>
            <div class="button-inner" style:color=var(--c-red)>
                <span class="material-symbols-outlined"> delete </span>
                <p> Delete Meetup </p>
            </div>
        </Button>
    </button>
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

            <div style:display=flex>
                {#each data.meetup.organisers as { id, name }, i}
                    {@const maxIndex = data.meetup.organisers.length - 1}
                    <a href="/user/{id}" class="regular-link"> {name} </a>

                    <p> 
                        {#if i < maxIndex}
                            {#if (i != maxIndex - 1)}
                                ,&nbsp;
                            {:else}
                                &nbsp;and&nbsp;
                            {/if}
                        {/if}
                    </p>
                {/each}
            </div>
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

    <div class="info-both">
        <div class="label-group">
            <p class="label">Registration Information</p>
            <div style:display=flex style:flex-direction=column style:row-gap=8px>
                {#if data.meetup.externalRegistrationLink}
                    <p> Registration is handled by an external service. Please register at the link below.  </p>

                    <a href={data.meetup.externalRegistrationLink} class="regular-link" > {data.meetup.externalRegistrationLink} </a>

                    <p> {data.meetup.registrationInformation} </p>
                {:else}
                    <p> Registration is done through Stripe via the Register button above </p>

                    <p> {data.meetup.registrationInformation} </p>
                {/if}
            </div>
        </div>
    </div>
</div>



<h3 class="fsize-title2" style:font-weight=500 style:margin-top=48px style:margin-bottom=16px>Schedule</h3>

{#if showPublishMessage}
    <Snackbar> 
        <span class="material-symbols-outlined" style:color={isPublished ? "var(--c-green)" : "var(--c-dg2)"}> check </span>
        <p style:font-weight=500 style:color={isPublished ? "var(--c-green)" : "var(--c-dg2)"}> {isPublished ? "Published!" : "Reverted to Draft"} </p>
    </Snackbar>
{/if}

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
        row-gap: 12px;

        flex-wrap: wrap;

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

    .info-both {
        margin-top: 24px;
        grid-column: 1/3;
    }


    .button-inner {
        display: flex;
        align-items: center;
        column-gap: 8px;
    }

    .button-inner span {
        font-size: 18px;
    }
</style>
