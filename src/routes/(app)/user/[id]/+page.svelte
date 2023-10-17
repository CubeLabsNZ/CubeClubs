<script lang="ts">
    import Card from '$lib/components/global/card/Card.svelte';
    import Badge, { BadgeSize } from "$lib/components/global/Badge.svelte";

    import TabBar from '$lib/components/global/TabBar.svelte';
    import MultiButton, { LabelType } from '$lib/components/global/MultiButton.svelte';

    import Medal, { PodiumPlace } from '$lib/components/user/Medal.svelte';

    import RecordRow from '$lib/components/user/RecordRow.svelte'

    import {regionToString} from '$lib/data/regions'

    import type { PageData } from './$types'

    import { formatTime, getRoundName } from "$lib/utils"

    import * as Icons from "$lib/assets/cube-icons/icons";

    import puzzles from "$lib/data/puzzles"
    import { Puzzle } from '$lib/db/enums';
    import Table, { DisplayType, MixDisplayMethod } from '$lib/components/global/Table.svelte';

    let resultsEventIndex: number = 0;
    $: resultsEvent = Object.keys(Puzzle)[resultsEventIndex]

    let historyIndex: number;

    export let data: PageData;
    let innerWidth = 1000;
    

    let resultsHistoryPuzzles = undefined

    data.streamed.results.then((results) => {
        resultsHistoryPuzzles = Object.keys(results)
    })

    let recordsHistoryPuzzles = undefined
    data.streamed.historicalRecords.then((results) => {
        recordsHistoryPuzzles = Object.keys(results)
    })

    function fmcTime(time: number) {
        return time == Infinity ? "DNF" : time;
    }
</script>

<svelte:window bind:innerWidth/>

<svelte:head>
    <title>{data.user.name}</title>
</svelte:head>

<div class="container-grid">
    <div class="user-container">
        <Card width={innerWidth > 700 ? 240 : null} clickable={false}>
            <div style:padding=16px>
                <div class="section-column">
                    <h3 style:font-weight=500 class="fsize-title2">{data.user.name}</h3>
                    <div class="section-row">
                        <Badge 
                            size={BadgeSize.Regular} 
                            fg=var(--c-g)
                            bg=var(--c-lgh)
                            label={regionToString(data.user.region)}/>

                        {#if data.user.is_club_organiser}
                            <Badge 
                                size={BadgeSize.Regular} 
                                fg=var(--c-a)
                                bg=var(--c-la1)
                                label="Club Organiser"/>
                        {/if}

                    </div>
                </div>

                <div class="card-column" style:margin-top=32px>
                    <div class="section-column">
                        <div class="data-row">
                            <p style:font-weight=500>{data.user._count.competing_in}</p>
                            <p> Meetups Attended </p>
                        </div>

                        <div class="data-row">
                            {#await data.streamed.completedSolves}
                                <p class="shimmering">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</p>
                            {:then completedSolves}
                                <p style:font-weight=500>{completedSolves}</p>
                            {/await}
                            <p> Completed Solves </p>
                        </div>
                    </div>

                    <hr>

                    <!-- TODO: reduce duplication ? -->
                    {#await data.streamed.medals}
                        <div class="section-column">
                            <div class="data-row">
                                <Medal place={PodiumPlace.Gold}/>

                                <p class="shimmering">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</p>
                                <p> Gold Medals </p>
                            </div>

                            <div class="data-row">
                                <Medal place={PodiumPlace.Silver}/>

                                <p class="shimmering">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</p>
                                <p> Silver Medals </p>
                            </div>

                            <div class="data-row">
                                <Medal place={PodiumPlace.Bronze}/>

                                <p class="shimmering">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</p>
                                <p> Bronze Medals </p>
                            </div>
                        </div>
                    {:then medals}
                    <div class="section-column">
                        <div class="data-row">
                            <Medal place={PodiumPlace.Gold}/>

                            <p style:font-weight=500>{medals[0]}</p>
                            <p> Gold Medals </p>
                        </div>

                        <div class="data-row">
                            <Medal place={PodiumPlace.Silver}/>

                            <p style:font-weight=500>{medals[1]}</p>
                            <p> Silver Medals </p>
                        </div>

                        <div class="data-row">
                            <Medal place={PodiumPlace.Bronze}/>

                            <p style:font-weight=500>{medals[2]}</p>
                            <p> Bronze Medals </p>
                        </div>
                    </div>
                    {/await}

                    <hr>


                    <div class="section-column">
                        <RecordRow
                            record={(async () => (await data.streamed.recordsCount).regional)()}
                            name="Regional Records" shortname=RR
                            bg=var(--c-lgreen) fg=var(--c-green)/>

                        <RecordRow
                            record={(async () => (await data.streamed.recordsCount).island)()}
                            name="Island Records" shortname=IR
                            bg=var(--c-lred) fg=var(--c-red)/>


                        <RecordRow
                            record={(async () => (await data.streamed.recordsCount).interclub)()}
                            name="Interclub Records" shortname=IcR
                            bg=var(--c-lpurple) fg=var(--c-purple)/>
                    </div>
                </div>
            </div>
        </Card>
    </div>

    <div class="content" style:margin-bottom=64px>
        <div class="pr-section">
            <h3 class="fsize-body" style:font-weight=500 style:padding-bottom=4px>Personal Records</h3>

            <table style:width=100%>
                <colgroup>
                    <col span=1 style:width=auto>
                    <col span=1 style:width=60px>
                    <col span=1 style:width=60px>
                    <col span=1 style:width=60px>
                    <col span=1 style:width=80px>
                    <col span=1 style:width=80px>
                    <col span=1 style:width=60px>
                    <col span=1 style:width=60px>
                    <col span=1 style:width=60px>
                </colgroup>

                <tbody>

                </tbody>


                <tr>
                    <th class="tc-event">Event</th>
                    <th class="tc-rr">RR</th>
                    <th class="tc-ir">IR</th>
                    <th class="tc-icr">IcR</th>
                    <th class="tc-result">Single</th>

                    <th class="tc-result">Average</th>
                    <th class="tc-icr">IcR</th>
                    <th class="tc-ir">IR</th>
                    <th class="tc-rr">RR</th>
                </tr>

                {#await data.streamed.PRs}
                    {#each Array(10).fill(0) as _}
                        <tr class="loading"><td colspan="999">&nbsp;</td></tr>
                    {/each}
                {:then PRs}
                    {#each Object.entries(PRs) as [puzzleType, {single, average}]}
                        {@const puzzle = puzzles[puzzleType]}
                        {@const isfmc = puzzleType == "FMC"}
                        <tr>
                            <td class="tc-event">
                                <div style:display=flex style:align-items=center style:column-gap=12px>
                                    <img src={puzzle.icon} alt="" height=24>
                                    {puzzle.name}
                                </div>
                            </td>
                            {#if single?.time != Infinity}
                                <td class="tc-rr">{single?.RR}</td>
                                <td class="tc-ir">{single?.IR}</td>
                                <td class="tc-icr">{single?.IcR}</td>
                                <td class="tc-result">{(isfmc ? fmcTime : formatTime)(single?.time, average.mbld_score, average.mbld_total)}</td>
                            {:else}
                                <td/><td/><td/><td/>
                            {/if}

                            {#if average.time != Infinity}
                                <td class="tc-result">{(isfmc ? fmcTime : formatTime)(average.time, average.mbld_score, average.mbld_total)}</td>
                                <td class="tc-icr">{average.IcR}</td>
                                <td class="tc-ir">{average.IR}</td>
                                <td class="tc-rr">{average.RR}</td>
                            {:else}
                                <td/><td/><td/><td/>
                            {/if}
                        </tr>
                    {/each}
                {/await}
            </table>
        </div>

        <div class="history-section">
            <TabBar labels={["Results History", "Records History"]} bind:selectedIndex={historyIndex} />

            {#if historyIndex == 0}
                <MultiButton bind:selectedIndex={resultsEventIndex} padding={4} fixedHeight={false} labels={
                Object.entries(puzzles).map( ([puzzle, info]) => (
                (resultsHistoryPuzzles ?? Object.keys(puzzles)).includes(puzzle) ? {type: LabelType.Image, data: info.icon} : undefined
                ))} />

                {@const ismbld = Object.keys(puzzles)[resultsEventIndex] == "MULTIBLD"}
                {@const isfmc = Object.keys(puzzles)[resultsEventIndex] == "FMC"}

                <div class="results-history">
                    <div class="results-history-header">
                        <img src={puzzles[resultsEvent].icon} alt="" height=28/>
                        <p class="fsize-body">{puzzles[resultsEvent].name} Results</p>
                    </div>

                    <Table
                        list={data.streamed.results}
                        k={resultsEvent}
                        showUser={false}
                        displayType={ismbld ? DisplayType.SINGLE : DisplayType.AVERAGE}
                        showBest={!ismbld}
                        hasSolves={!ismbld}
                        meetupAndRoundLeft={true}
                        showPlace={true}
                        {ismbld}
                        {isfmc}
                    />

                </div>
            {:else}
                <div class="records-history">
                    {#each Object.entries(puzzles) as [puzzle, { name, icon }], i}
                        {#if recordsHistoryPuzzles?.includes(puzzle) ?? true}
                            {@const ismbld = puzzle == "MULTIBLD"}
                            {@const isfmc = puzzle == "FMC"}
                            <div class="group-label records-history-header">
                                <img src={puzzles[puzzle].icon} alt="" height=28/>
                                <p class="fsize-body">{puzzles[puzzle].name} Records</p>
                            </div>

                            <Table
                                list={data.streamed.historicalRecords}
                                k={puzzle}
                                displayType={ismbld ? DisplayType.SINGLE : DisplayType.MIX}
                                hasMeetup={true}
                                displayRank={false}
                                showDate={true}
                                mixDisplayMethod={MixDisplayMethod.SeparateAverageAndSingle}
                                showUser={false}
                                {ismbld}
                                {isfmc}
                                hasSolves={!ismbld}
                                singleDisplayModeIgnoreAvg={ismbld}
                            />
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>


<style>
    .group-label {
        height: 28px;
        display: flex;
        flex-direction: row;
        column-gap: 8px;

        margin-bottom: 4px;
        margin-top: 48px;
    }

    .group-label:first-of-type {
        margin-top: 0;
    }

    .section-column, .card-column, .data-row {
        display: flex;
    }

    .section-column {
        flex-direction: column;
        row-gap: 4px;
    }

    .section-row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 4px;
    }

    .card-column {
        flex-direction: column;
        row-gap: 12px;
    }

    .data-row {
        flex-direction: row;
        align-items: center;
        column-gap: 12px;
    }

    hr {
        border: none;
        border-bottom: 1.5px solid var(--c-lg1);
        height: 1.5px;

        width: 100%;
    }


    .container-grid {
        display: flex;
        width: 1000px;
        margin-left: auto;
        margin-right: auto;

        padding-top: 100px;

        column-gap: 16px;
    }

    .user-container {
        width: 240px;
    }

    .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 48px;
    }

    @media(max-width: 1040px) {
        .container-grid {
            width: calc(100% - 40px);

            padding-left: 20px;
            padding-right: 20px;
        }

    }

    @media(max-width: 700px) {
        .container-grid {
            width: 100%;

            flex-direction: column;
        }

        .user-container {
            width: 100%;
        }

        .content {
            width: 100%;
        }

        .pr-section {
            margin-top: 16px;
        }
    }


    /* INFO: personal records table */
    td, th {
        text-align: right;
    }

    .tc-event {
        text-align: left;
        min-width: 100px;
    }

    td.tc-result {
        font-weight: 500;
    }

    td.tc-event {
        font-weight: 500;
    }

    td.tc-rr {
        color: var(--c-g);
    }

    td.tc-ir {
        color: var(--c-dg1);
    }

    td.tc-icr {
        color: var(--c-dg2);
    }




    /* INFO: history section */
    .history-section {
        display: flex;
        flex-direction: column;
        row-gap: 16px;
    }

    .results-history-header, .records-history-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 4px;

        margin-top: 16px;
        margin-bottom: 4px;
    }

    .results-history-header *, .records-history-header * {
        font-weight: 500;
    }
</style>
