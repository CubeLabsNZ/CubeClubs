<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    import regions, { regionToString } from "$lib/data/regions";
    import puzzles from "$lib/data/puzzles";

    import { Region } from "@prisma/client";

    import Select from "$lib/components/global/Select.svelte";
    import PageContent from "$lib/components/global/PageContent.svelte";

    import MultiButton, { LabelType } from "$lib/components/global/MultiButton.svelte";


    import type { PageData } from "./$types"


    let regionSelected: string, displayType: number;

    $: updateQuery(regionSelected, displayType);

    function updateQuery(selectedRegion: string, displayType: number) {
        if (!browser) { return }

        let query = new URLSearchParams($page.url.searchParams.toString());

        if (selectedRegion == "") {
            query.delete("region")
        } else {
            query.set("region", selectedRegion);
        }


        query.set("displayType", displayType ? "history" : "current");


        goto(`?${query.toString()}`);
    }




    interface Result {
        name: string;
        result: number;
        region: Region;
        meetupName: string;
        data: any;
    }

    export let data: PageData
</script>


<svelte:head>
    <title>Records</title>
</svelte:head>


<PageContent
    heading="Records"
    subheading="Records shown are for all records broken at meetups and are not grouped by age or gender.">

    <div class="filter-bar">
        <div class="label-group">
            <p class="label">Region</p>

            <Select name="region" bind:value={regionSelected}>
                <option selected value>All Regions</option>
                {#each Object.keys(regions) as value }
                    <option value={value}>{regionToString(value)}</option>
                {/each}
            </Select>
        </div>

        <div class="label-group">
            <p class="label">Show</p>

            <MultiButton bind:selectedIndex={displayType} labels={[
                {type: LabelType.Text, data: "Current"},
                {type: LabelType.Text, data: "History"}
            ]} /> 
        </div>
    </div>

    {#if displayType == 0} <!-- current -->
        {#each Object.entries(puzzles) as [puzzle, { name, icon }], i}
            {@const single = data.records[puzzle]?.single}
            {@const average = data.records[puzzle]?.average}
            <div class={"group-label group-label-" + i}>
                <img src={icon} alt="">

                <h3 class="fsize-title2">{name}</h3>
            </div>


            <table>
                <!-- NOTE: tc-dummy is entirely invisible to provide padding to either side of the table -->
                <tr>
                    <th class="tc-dummy"></th>

                    <th class="tc-type">Format</th>
                    <th class="tc-name">Name</th>
                    <th class="tc-result">Average</th>
                    <th class="tc-region">Region</th>
                    <th class="tc-meetup">Meetup</th>
                    <th class="tc-solves">Solves</th>

                    <th class="tc-dummy"></th>
                </tr>

                <!-- NOTE: td-dummy is entirely invisible to provide padding to the top and bottom of the table -->
                <tr class="td-dummy">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                {@debug data}

                <!-- INFO: single -->
                {#if single}
                    <tr>
                        <td class="tc-dummy"></td>

                        <td class="tc-type">Single</td>
                        <td class="tc-name"><a href={`/user/${single.result.user.id}`}>{single.result.user.name}</a></td>
                        <td class="tc-result">{single.time}</td>
                        <td class="tc-region">{regionToString(single.result.user.region)}</td>
                        <td class="tc-meetup"><a href={`/meetups/${single.result.round.meetup.id}`}>{single.result.round.meetup.name}</a></td>
                        <td class="tc-solves"></td>

                        <td class="tc-dummy"></td>
                    </tr>
                {/if}


                <!-- INFO: average-->
                {#if average}
                <tr>
                    <td class="tc-dummy"></td>

                    <td class="tc-type">Average</td>
                    <td class="tc-name"><a href={`/user/${average.user.id}`}>{average.user.name}</a></td>
                    <td class="tc-result">{average.average}</td>
                    <td class="tc-region">{regionToString(average.user.region)}</td>
                    <td class="tc-meetup"><a href={`/meetups/${average.round.meetup.id}`}>{average.round.meetup.name}</a></td>
                    <td class="tc-solves">{average.solves.map(s => s.time).join(', ')}</td>

                    <td class="tc-dummy"></td>
                </tr>
                {/if}



                <tr class="td-dummy">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
        {/each}
    {:else}
        {#each Object.entries(puzzles) as [puzzle, { name, icon }], i}
            <div class={"group-label group-label-" + i}>
                <img src={icon} alt="">

                <h3 class="fsize-title2">{name} History</h3>
            </div>


            <table>
                <!-- NOTE: tc-dummy is entirely invisible to provide padding to either side of the table -->
                <tr>
                    <th class="tc-dummy"></th>

                    <th class="tc-type">Date</th>
                    <th class="tc-name">Name</th>
                    <th class="tc-result">Single</th>
                    <th class="tc-result">Average</th>
                    <th class="tc-region">Region</th>
                    <th class="tc-meetup">Meetup</th>
                    <th class="tc-solves">Solves</th>

                    <th class="tc-dummy"></th>
                </tr>

                <!-- NOTE: td-dummy is entirely invisible to provide padding to the top and bottom of the table -->
                <tr class="td-dummy">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>


                <tr>
                    <td class="tc-dummy"></td>

                    <td class="tc-type">Date</td>
                    <td class="tc-name">Name</td>
                    <td class="tc-result">Single</td>
                    <td class="tc-result">Average</td>
                    <td class="tc-region">Region</td>
                    <td class="tc-meetup">Meetup</td>
                    <td class="tc-solves">Solves</td>

                    <td class="tc-dummy"></td>
                </tr>



                <tr class="td-dummy">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
        {/each}


    {/if}

</PageContent>


<style>
    .group-label {
        height: 28px;
        display: flex;
        flex-direction: row;
        column-gap: 8px;

        margin-bottom: 4px;
        margin-top: 48px;
    }

    .group-label-0 {
        margin-top: 0;
    }

    .group-label h3 {
        font-weight: 500;
    }
    


    .tc-name, .tc-region, .tc-meetup, .tc-solves, .tc-type {
        text-align: left;
    }

    .tc-name {
        min-width: 200px;
    }

    .tc-result, .tc-name {
        font-weight: 500;
    }

    tr:not(:first-child) .tc-name > a,
    tr:not(:first-child) .tc-meetup > a {
        color: var(--c-a);
    }

    .tc-result {
        text-align: right;
    }

    .tc-type {
        color: var(--c-dg1);
    }

    .filter-bar {
        padding-bottom: 32px;
    }
</style>
