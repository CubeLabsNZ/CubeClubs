<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    import puzzles from "$lib/data/puzzles";

    import PageContent from "$lib/components/global/PageContent.svelte";
    import TabBar from "$lib/components/global/TabBar.svelte";
    import Button, {
        ButtonSize,
        ButtonType,
    } from "$lib/components/global/Button.svelte";

    import Card from "$lib/components/global/card/Card.svelte";
    import type { PageData } from "./$types";
    import {regionToString} from "$lib/data/regions";

    let tabs = new Map();
    tabs.set("info", 0);
    tabs.set("competitors", 1);
    tabs.set("schedule", 2);

    let tab = $page.url.searchParams.get("tab");
    let tabIndex: number = tab == null ? 0 : tabs.get(tab);

    export let data: PageData;

    $: {
        updateQuery(tabIndex);
        tab = $page.url.searchParams.get("tab");
    }

    function updateQuery(tabIndex: number) {
        if (!browser) {
            return;
        }

        let query = new URLSearchParams($page.url.searchParams.toString());

        query.set(
            "tab",
            (() => {
                switch (tabIndex) {
                    case 0:
                        return "info";
                    case 1:
                        return "competitors";
                    case 2:
                        return "schedule";
                    default:
                        return "";
                }
            })()
        );

        goto(`?${query.toString()}`);
    }
</script>

<svelte:head>
    <title>{data.meetup.name}</title>
</svelte:head>

<PageContent heading={data.meetup.name} subheading={data.meetup.club.name}>
    <TabBar
        labels={["Info", "Competitors", "Schedule & Results"]}
        bind:selectedIndex={tabIndex}>
        <!-- <a href={`/meetups/${data.meetup.id}/register`}> -->
        <!--     <Button size={ButtonSize.Small}> -->
        <!--         <div -->
        <!--             style:display="flex" -->
        <!--             style:column-gap="8px" -->
        <!--             style:align-items="center"> -->
        <!--             <span class="material-symbols-outlined" style:font-size="16px">login</span> -->
        <!--             <p>Register</p> -->
        <!--         </div> -->
        <!--     </Button> -->
        <!-- </a> -->
    </TabBar>

    <div class="content">
        {#if tab === "schedule"}
            <div class="schedule-grid">
                <!-- TODO: for each scheduled event -->
                {#each data.meetup.rounds as round}
                    {@const puzzle = puzzles[round.puzzle]}
                    <Card height={60}>
                        <div class="schedule-item">
                            <p>IMG</p>

                            <div class="schedule-item-title">
                                <p style:font-weight="600">
                                    {puzzle.name} - Round {round.number}
                                </p>
                                <p
                                    style:font-weight="500"
                                    style:color="var(--c-dg1)"
                                >
                                    {round.startDate} - {round.endDate}
                                </p>
                            </div>
                        </div>
                    </Card>
                {/each}
            </div>
        {:else if tab === "competitors"}
            <table>
                <!-- TODO: for each event in the meetup, show new column AND show ticks for registered */
                <!-- NOTE: tc-dummy is entirely invisible to provide padding to either side of the table -->
                <tr>
                    <th class="tc-dummy" />

                    <th class="tc-name">Name</th>
                    <th class="tc-region">Region</th>

                    {#each data.puzzles as puzzle}
                        <th class="tc-puzzle">
                            <img src={puzzles[puzzle].icon} alt={puzzles[puzzle].name} style:height=24px>
                        </th>
                    {/each}

                    <th class="tc-dummy" />
                </tr>

                <!-- NOTE: td-dummy is entirely invisible to provide padding to the top and bottom of the table -->
                <tr class="td-dummy">
                    <td />
                    <td />
                    <td />

                    {#each data.puzzles as puzzle}
                        <td />
                    {/each}

                    <td />
                </tr>


                {#each data.meetup.users as { user }}
                    <tr>
                        <td class="tc-dummy" />
                        <td class="tc-name">
                            <a href="/user/{user.id}"> {user.name} </a>
                        </td>
                        <td class="tc-region">{regionToString(user.region)}</td>


                        <!-- TODO: only show checkmark if user has registeed  -->
                        {#each data.puzzles as puzzle}
                            <td class="tc-puzzle">
                                <span class="material-symbols-outlined">check</span>
                            </td>
                        {/each}

                        <td class="tc-dummy" />
                    </tr>
                {/each}

                <tr class="td-dummy">
                    <td />
                    <td />
                    <td />
                    <td />
                </tr>
            </table>
        {:else}
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

                <div class="info-both">
                    <div class="label-group">
                        <p class="label">Registration Information</p>
                        {#if data.meetup.externalRegistrationLink}
                            <p> Registration is handled by an external service. Please register at the link below. </p>

                            <a href={data.meetup.externalRegistrationLink} class="registration-link" > {data.meetup.externalRegistrationLink} </a>
                        {:else}
                            <p>
                                Registration is done through Stripe via the Register
                                button above. The registration fee for this meetup
                                is $20. We don’t profit off these meetups! All of
                                the registration fees go towards hiring the venue
                                and equipment.
                            </p>
                        {/if}
                    </div>
                </div>
            </div>
        {/if}
    </div>
</PageContent>

<style>
    .content {
        margin-top: 32px;
    }

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

    /* INFO: competitors tab */
    .tc-name,
    .tc-region,
    .tc-puzzle {
        text-align: left;
    }

    .tc-name {
        min-width: 200px;
        font-weight: 500;
    }

    tr:not(:first-child) .tc-name,
    tr:not(:first-child) .tc-name a {
        color: var(--c-a);
    }


    tr:first-child .tc-puzzle {
        vertical-align: top;
    }


    .tc-puzzle {
        width: 24px;
    }

    tr:first-child .tc-puzzle img {
        filter: invert(30%) sepia(7%) saturate(500%) hue-rotate(164deg) brightness(94%) contrast(89%);
        transform: translateY(2px);
    }

    .tc-puzzle img {
        height: 24px;
    }

    /* INFO: schedule/results tab */
    .schedule-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
    }

    .schedule-item {
        display: flex;
        align-items: center;
        padding-left: 12px;

        column-gap: 8px;
    }

    .schedule-item-title {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .registration-link {
        margin-top: 8px;
        color: var(--c-a);

        transition: color var(--v-animation-delay) ease-in-out;
    }

    .registration-link:hover {
        color: var(--c-da1);
    }
</style>
