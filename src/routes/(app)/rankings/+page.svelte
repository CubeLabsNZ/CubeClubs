<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    import regions, {regionToString} from "$lib/data/regions";

    import { Puzzle, Region } from "@prisma/client";

    import MultiButton, { LabelType } from "$lib/components/global/MultiButton.svelte";
    import Select from "$lib/components/global/Select.svelte";


    import PageContent from "$lib/components/global/PageContent.svelte";

    import { formatTime } from "$lib/utils"

    import type { PageData } from "./$types"
    import puzzles from "$lib/data/puzzles";
    import formats from "$lib/data/formats";

    export let data: PageData

    // INFO: format: 0 = single, 1 - average

    let formatIndex: number;
    let regionSelected: string
    let eventSelected: string;

    // TODO: make stupid multibutton more fleible than just stupid index stupid
    let eventIndex = Object.keys(puzzles).indexOf($page.url.searchParams.get("event")) ?? 0

    let selectedResults;

// TODO: make this good and all backend 
    $: {
        eventSelected = Object.keys(puzzles)[eventIndex];
        console.log("EVENT INDEX IS " + eventIndex)
        console.log("EVENT SELECTED IS NOW " + eventSelected)

        updateQuery(formatIndex, eventSelected, regionSelected);
        selectedResults = formatIndex ? data.results.average[eventSelected] : data.results.single[eventSelected];
        console.assert(selectedResults)

    }

    async function updateQuery(formatIndex: number, selectedEvent: number, selectedRegion: string) {
        if (!browser) { return }

        let query = new URLSearchParams($page.url.searchParams.toString());

        query.set("format", formatIndex ? "average" : "single");

        query.set("event", selectedEvent);

        if (selectedRegion == "") {
            query.delete("region")
        } else {
            query.set("region", selectedRegion);
        }

        goto(`?${query.toString()}`);
    }
</script>


<svelte:head>
    <title>Rankings</title>
</svelte:head>


<PageContent 
    heading="Rankings"
    subheading="Rankings shown are for all solves done at meetups and are not grouped by age or gender.">  

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
            <p class="label">Format</p>

            <MultiButton bind:selectedIndex={formatIndex} labels={[
                {type: LabelType.Text, data: "Single"},
                {type: LabelType.Text, data: "Average"}
            ]} /> 
        </div>
    </div>

    <div class="filter-bar">
        <div class="label-group">
            <p class="label">Event</p>

            <MultiButton bind:selectedIndex={eventIndex} padding={4} fixedHeight={false} labels={ Object.values(puzzles).map(p => ({type: LabelType.Image, data: p.icon})) } />
        </div>
    </div>


    <table style:margin-top=16px>
        <colgroup>
            <col span=1 style:width=8px>

            <col span=1 style:width=50px>
            <col span=1 style:width=160px>
            <col span=1 style:width=80px>
            <col span=1 style:width=80px>
            <col span=1 style:width=auto>

            {#if formatIndex}
                <col span=1 style:width=auto>
            {/if}

            <col span=1 style:width=8px>
        </colgroup>

        <tbody>
            <tr>
                <th class="tc-dummy"></th>

                <th class="tc-ranking"></th>
                <th class="tc-name">Name</th>
                <th class="tc-result">Average</th>
                <th class="tc-region">Region</th>
                <th class="tc-meetup">Meetup</th>

                {#if formatIndex}
                    <th class="tc-solves">Solves</th>
                {/if}

                <th class="tc-dummy"></th>
            </tr>

            <tr class="td-dummy">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>

                {#if formatIndex}
                    <td></td>
                {/if}

                <td></td>
            </tr>


            {#if data.results}
                {#if formatIndex}
                    {#if Object.keys(data.results.average).length > 0}
                        {#each selectedResults as average, i }
                            <tr>
                                <td class="tc-dummy"></td>

                                <td class="tc-ranking">{i + 1}</td>
                                <td class="tc-name"><a class="regular-link" href={`/user/${average.user.id}`}>{average.user.name}</a></td>
                                <td class="tc-result">{formatTime(average.value)}</td>
                                <td class="tc-region">{regionToString(average.user.region)}</td>
                                <td class="tc-meetup"><a class="regular-link" href={`/meetups/${average.round.meetup.id}`}>{average.round.meetup.name}</a></td>

                                <td class="tc-solves">{average.solves.map(s => formatTime(s.time)).join(", ")}</td>

                                <td class="tc-dummy"></td>
                            </tr>
                        {/each}
                    {/if}
                {:else}
                    {#if Object.keys(data.results.single).length > 0}
                        {#each selectedResults as single, i }
                            <tr>
                                <td class="tc-dummy"></td>

                                <td class="tc-ranking">{i + 1}</td>
                                <td class="tc-name"><a class="regular-link" href={`/user/${single.result.user.id}`}>{single.result.user.name}</a></td>
                                <td class="tc-result">{formatTime(single.time)}</td>
                                <td class="tc-region">{regionToString(single.result.user.region)}</td>
                                <td class="tc-meetup"><a class="regular-link" href={`/meetups/${single.result.round.meetup.id}`}>{single.result.round.meetup.name}</a></td>

                                <td class="tc-dummy"></td>
                            </tr>
                        {/each}
                    {/if}
                {/if}
            {/if}


            <tr class="td-dummy">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>

                {#if formatIndex}
                    <td></td>
                {/if}

                <td></td>
            </tr>
        </tbody>



    </table>


</PageContent>



<style>
    .tc-name, .tc-region, .tc-meetup, .tc-solves {
        text-align: left;
    }

    .tc-result, .tc-name {
        font-weight: 500;
    }

    .tc-result, .tc-ranking {
        text-align: right;
    }

    .tc-ranking {
        color: var(--c-dg1);
    }

    .filter-bar {
        padding-bottom: 8px;
    }

    .filter-bar:last-of-type {
        padding-bottom: 16px;
    }
</style>
