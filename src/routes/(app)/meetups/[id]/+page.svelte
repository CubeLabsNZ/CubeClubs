<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";


    import DetailPage from "$lib/components/DetailPage.svelte";
    import TabBar from "$lib/components/TabBar.svelte";
    import Button, { ButtonSize, ButtonType } from "$lib/components/Button.svelte";

    import Bar from "$lib/components/Bar.svelte";

    let tabs = new Map();
    tabs.set("info", 0);
    tabs.set("competitors", 1);
    tabs.set("schedule", 2);


    let tab = $page.url.searchParams.get("tab");
    let tabIndex: number = (tab == null) ? 0 : tabs.get(tab);

    export let data;  // the slug

    $: {
        updateQuery(tabIndex);
        tab = $page.url.searchParams.get("tab");
    }


    function updateQuery(tabIndex: number) {
        if (!browser) { return }

        let query = new URLSearchParams($page.url.searchParams.toString());

        query.set("tab", (() => {
            switch (tabIndex) {
                case 0: 
                    return "info";
                case 1: 
                    return "competitors";
                case 2: 
                    return "schedule";
                default:
                    return ""
            }
        })());

        goto(`?${query.toString()}`);
    }
</script>

<svelte:head>
    <title>meetuip name</title>
</svelte:head>


<DetailPage heading="meetup name" subheading="club name">
    <TabBar labels={["Meetup Info", "Competitors", "Schedule & Results"]} bind:selectedIndex={tabIndex}>
        <Button size={ButtonSize.Small} type={ButtonType.Bordered} perform={() => { goto(`/meetups/${data.id}/register`) }}>
            <div style:display=flex style:column-gap=8px style:align-items=center>
                <span class="material-symbols-outlined" style:font-size=16px>login</span>
                <p> Register </p>
                
            </div>
        </Button>
    </TabBar>
    
    <div class="content">
        {#if tab === "schedule"}
            <div class="schedule-grid">
                <!-- TODO: for each scheduled event -->
                {#each Array(5) as _, i}
                    <button>
                        <Bar height={60}>
                            <div class="schedule-item">
                                <p> IMG </p>

                                <div class="schedule-item-title">
                                    <p style:font-weight=600> SCHEDULE EVENT TITLE </p>
                                    <p style:font-weight=500 style:color=var(--c-dg1)> SCHEDULE EVENT TIME </p>
                                </div>
                            </div>

                        </Bar>

                    </button>
                    
                {/each}
            </div>
        {:else if tab === "competitors"}
            <table>
                <!-- TODO: for each event in the meetup, show new column AND show ticks for registered */
                <!-- NOTE: tc-dummy is entirely invisible to provide padding to either side of the table -->
                <tr>
                    <th class="tc-dummy"></th>

                    <th class="tc-name">Name</th>
                    <th class="tc-region">Region</th>

                    <th class="tc-dummy"></th>
                </tr>

                <!-- NOTE: td-dummy is entirely invisible to provide padding to the top and bottom of the table -->
                <tr class="td-dummy">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>


                <tr>
                    <td class="tc-dummy"></td>

                    <td class="tc-name">NAME</td>
                    <td class="tc-region">REGION</td>

                    <td class="tc-dummy"></td>
                </tr>


                <tr class="td-dummy">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
        {:else}
            <div class="info-grid">
                <div class="info-left">
                    <div class="label-group">
                        <p class="label">Date</p>
                        <p> DATE </p>
                    </div>


                    <div class="label-group">
                        <p class="label">Venue</p>
                        <p> VENUE </p>
                    </div>


                    <div class="label-group">
                        <p class="label">Location</p>
                        <p> LOCATION </p>
                    </div>


                    <div class="label-group">
                        <p class="label">Organisers</p>
                        <ul>
                            <li>organiser 1</li>
                            <li>organiser 2</li>
                            <li>organiser 3</li>
                        </ul>
                    </div>


                    <div class="label-group">
                        <p class="label">Competitor Limit</p>
                        <p> COMPETITOR LIMIT </p>
                    </div>
                </div>


                <div class="info-right">
                    <div class="label-group">
                        <p class="label">Meetup Description</p>
                        <p> DESCRIPTION </p>
                    </div>
                </div>


                <div class="info-both">
                    <div class="label-group">
                        <p class="label">Registration Information</p>
                        <!-- TODO: if stripe active, use this message, otherwise display external registration link -->
                        <p> Registration is done through Stripe via the Register button above. The registration fee for this meetup is $20. We don’t profit off these meetups! All of the registration fees go towards hiring the venue and equipment. </p>
                    </div>
                </div>
            </div>
        {/if}
    </div>
    
</DetailPage>



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

    .info-left, .info-right {
        display: flex;
        flex-direction: column;
        row-gap: 24px;
    }

    .info-both {
        margin-top: 24px;
        grid-column: 1/3;
    }



    /* INFO: competitors tab */
    .tc-name, .tc-region {
        text-align: left;
    }

    .tc-name {
        min-width: 200px;
    }

    .tc-name {
        font-weight: 500;
    }

    tr:not(:first-child) .tc-name {
        color: var(--c-a);
    }



    /* INFO: schedule/results tab */
    .schedule-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
    }

    button {
        padding: 0;
        margin: 0;
        background-color: transparent;
        border: none;
    }

    .schedule-item {
        display: flex;
        align-items: center;
        padding: 11px;

        column-gap: 8px;
    }

    .schedule-item-title {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
</style>
