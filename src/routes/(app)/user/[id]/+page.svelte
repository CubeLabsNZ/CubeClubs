<script lang="ts">
    import Card from '$lib/components/global/card/Card.svelte';
    import Badge, { BadgeSize } from "$lib/components/global/Badge.svelte";

    import TabBar from '$lib/components/global/TabBar.svelte';
    import MultiButton, { LabelType } from '$lib/components/global/MultiButton.svelte';

    import Medal, { PodiumPlace } from '$lib/components/user/Medal.svelte';

    import RecordRow from '$lib/components/user/RecordRow.svelte'

    import {regionToString} from '$lib/data/regions'

    import type { PageData } from './$types'

    import { formatTime } from "$lib/utils"

    import * as Icons from "$lib/assets/cube-icons/icons";

    import puzzles from "$lib/data/puzzles"

    let resultsEventIndex: number;

    let historyIndex: number;

    export let data: PageData;
    let innerWidth = 1000;
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

                        {#if data.user.isClubOrganiser}
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
                            <p style:font-weight=500>{data.meetupsAttended}</p>
                            <p> Meetups Attended </p>
                        </div>

                        <div class="data-row">
                            <p style:font-weight=500>{data.completedSolves}</p>
                            <p> Completed Solves </p>
                        </div>
                    </div>

                    <hr>

                    <div class="section-column">
                        <div class="data-row">
                            <Medal place={PodiumPlace.Gold}/>

                            <p style:font-weight=500>{data.medals[0]}</p>
                            <p> Gold Medals </p>
                        </div>

                        <div class="data-row">
                            <Medal place={PodiumPlace.Silver}/>

                            <p style:font-weight=500>{data.medals[1]}</p>
                            <p> Silver Medals </p>
                        </div>

                        <div class="data-row">
                            <Medal place={PodiumPlace.Bronze}/>

                            <p style:font-weight=500>{data.medals[2]}</p>
                            <p> Bronze Medals </p>
                        </div>
                    </div>

                    <hr>


                    <div class="section-column">
                        <div class="data-row">
                            <RecordRow
                                record={data.records.regional}
                                name="Regional Records" shortname=RR
                                bg=var(--c-lgreen) fg=var(--c-green)/>
                        </div>

                        <div class="data-row">
                            <RecordRow
                                record={data.records.island}
                                name="Island Records" shortname=IR
                                bg=var(--c-lred) fg=var(--c-red)/>
                        </div>


                        <div class="data-row">
                            <RecordRow
                                record={data.records.interclub}
                                name="Interclub Records" shortname=IcR
                                bg=var(--c-lpurple) fg=var(--c-purple)/>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    </div>

    <div class="content">
        <div class="pr-section">
            <h3 class="fsize-body" style:font-weight=500>Personal Records</h3>

            <table style:width=100%>
                <colgroup>
                    <col span=1 style:width=8px>

                    <col span=1 style:width=auto>
                    <col span=1 style:width=60px>
                    <col span=1 style:width=60px>
                    <col span=1 style:width=60px>
                    <col span=1 style:width=80px>
                    <col span=1 style:width=80px>
                    <col span=1 style:width=60px>
                    <col span=1 style:width=60px>
                    <col span=1 style:width=60px>

                    <col span=1 style:width=8px>
                </colgroup>

                <tbody>

                </tbody>


                <tr>
                    <th class="tc-dummy"></th>

                    <th class="tc-event">Event</th>
                    <th class="tc-rr">RR</th>
                    <th class="tc-ir">IR</th>
                    <th class="tc-icr">IcR</th>
                    <th class="tc-result">Single</th>

                    <th class="tc-result">Average</th>
                    <th class="tc-icr">IcR</th>
                    <th class="tc-ir">IR</th>
                    <th class="tc-rr">RR</th>

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
                    <td></td>
                    <td></td>
                </tr>


                {#each Object.entries(data.PRs) as [puzzleType, {single, average}]}
                    {@const puzzle = puzzles[puzzleType]}
                    <tr>
                        <td class="tc-dummy"></td>

                        <td class="tc-event">
                            <div style:display=flex style:align-items=center style:column-gap=12px>
                                <img src={puzzle.icon} alt="" height=24>
                                {puzzle.name}
                            </div>
                        </td>
                        <td class="tc-rr">{single.RR}</td>
                        <td class="tc-ir">{single.IR}</td>
                        <td class="tc-icr">{single.IcR}</td>
                        <td class="tc-result">{formatTime(single.time)}</td>

                        <td class="tc-result">{formatTime(average.time)}</td>
                        <td class="tc-icr">{average.IcR}</td>
                        <td class="tc-ir">{average.IR}</td>
                        <td class="tc-rr">{average.RR}</td>

                        <td class="tc-dummy"></td>
                    </tr>
                {/each}


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
                    <td></td>
                    <td></td>
                </tr>
            </table>
        </div>

        <div class="history-section">
            <TabBar labels={["Results History", "Records History"]} bind:selectedIndex={historyIndex} />

            {#if historyIndex == 0}
                <MultiButton bind:selectedIndex={resultsEventIndex} padding={4} fixedHeight={false} labels={[
                    {type: LabelType.Image, data: Icons.Icon3},
                    {type: LabelType.Image, data: Icons.Icon2},
                    {type: LabelType.Image, data: Icons.Icon4},
                    {type: LabelType.Image, data: Icons.Icon5},
                    {type: LabelType.Image, data: Icons.Icon6},
                    {type: LabelType.Image, data: Icons.Icon7},

                    {type: LabelType.Image, data: Icons.IconSq1},
                    {type: LabelType.Image, data: Icons.IconSkewb},
                    {type: LabelType.Image, data: Icons.IconPyra},
                    {type: LabelType.Image, data: Icons.IconMega},
                    {type: LabelType.Image, data: Icons.IconOH},
                    {type: LabelType.Image, data: Icons.IconClock},

                    {type: LabelType.Image, data: Icons.IconFMC},
                    {type: LabelType.Image, data: Icons.Icon3bld},
                    {type: LabelType.Image, data: Icons.IconMbld},
                    {type: LabelType.Image, data: Icons.Icon4bld},
                    {type: LabelType.Image, data: Icons.Icon5bld},
                ]} />

                <div class="results-history">
                    <div class="results-history-header">
                        <img src={Icons.Icon3} alt="" height=28/>
                        <p class="fsize-body">3x3 Results (index = {resultsEventIndex})</p>
                    </div>

                    <table style:width=100%>
                        <tr>
                            <th class="tc-dummy"></th>

                            <th class="tc-meetup">Meetup</th>
                            <th class="tc-round">Round</th>
                            <th class="tc-place">Place</th>
                            <th class="tc-single">Single</th>
                            <th class="tc-average">Average</th>
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


                        <tr>
                            <td class="tc-dummy"></td>

                            <td class="tc-meetup">Meetup</td>
                            <td class="tc-round">Round</td>
                            <td class="tc-place">Place</td>
                            <td class="tc-single">Single</td>
                            <td class="tc-average">Average</td>
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
                        </tr>
                    </table>
                </div>
            {:else}
                <div class="records-history">
                    <!-- INFO: for each event that HAS a record, either single or average -->

                    <table style:width=100%>
                        <tr>
                            <th class="tc-dummy"></th>

                            <th class="tc-single">Single</th>
                            <th class="tc-average">Average</th>
                            <th class="tc-meetup">Meetup</th>
                            <th class="tc-round">Round</th>
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
                        </tr>


                        <tr>
                            <td class="tc-dummy"></td>

                            <td class="tc-single">Single</td>
                            <td class="tc-average">Average</td>
                            <td class="tc-meetup">Meetup</td>
                            <td class="tc-round">Round</td>
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
                        </tr>
                    </table>
                </div>
            {/if}
        </div>
    </div>
</div>


<style>
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

        margin-top: 126px; /* tab bar + 32px either side */

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

            margin-left: 20px;
            margin-right: 20px;
        }

    }

    @media(max-width: 700px) {
        .container-grid {
            width: 100%;

            flex-direction: column;
        }

        .user-container {
            width: calc(100% - 40px);
        }

        .content {
            width: calc(100% - 40px);
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

    .tc-meetup, .tc-round, .tc-place, .tc-solves {
        text-align: left;
    }

    .tc-meetup, .tc-single, .tc-average {
        font-weight: 500;
    }

    .results-history-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 4px;

        margin-top: 16px;
        margin-bottom: 4px;
    }

    .results-history-header * {
        font-weight: 500;
    }
</style>
