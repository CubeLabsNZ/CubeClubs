<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";

    import TabBar from "$lib/components/global/TabBar.svelte";

    import type { PageData } from "./$types";
    export let data: PageData;

    let locations = ["info", "competitors", "schedule"]
    let tabIndex = 0;

    $: {
        if (browser) {
            goto(`/meetups/${data.slug}/` + locations[tabIndex], { replaceState: true })
        }
    }
</script>


<TabBar
    labels={["Info", "Competitors", "Schedule & Results"]}
    bind:selectedIndex={tabIndex}>
</TabBar>

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
                {#each data.meetup.organisers as { user_id, user }, i}
                    {@const maxIndex = data.meetup.organisers.length - 1}
                    <a href="/user/{user_id}" class="regular-link">{user.name}</a>

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
            <p>{data.meetup.competitor_limit ?? "No competitor Limit"}</p>
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
                {#if data.meetup.external_registration_link}
                    <p> Registration is handled by an external service. Please register at the link below.  </p>

                    <a href={data.meetup.external_registration_link} class="regular-link" > {data.meetup.external_registration_link} </a>

                    <p> {data.meetup.registration_information} </p>
                {:else}
                    <p> Registration is done through Stripe via the Register button above. </p>

                    <p> {data.meetup.registration_information} </p>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    /* INFO: info tab */
    .info-grid {
        display: grid;
        grid-auto-columns: 1fr;
        grid-auto-flow: column;

        column-gap: 16px;

        margin-top: 32px;
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
</style>

