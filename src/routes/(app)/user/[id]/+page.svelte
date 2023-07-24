<script lang="ts">
    import Card from '$lib/components/global/card/Card.svelte';
    import Badge, { BadgeSize } from "$lib/components/global/Badge.svelte";

    import TabBar from '$lib/components/global/TabBar.svelte';
    import MultiButton, { LabelType } from '$lib/components/global/MultiButton.svelte';

    import * as Icons from "$lib/assets/cube-icons/icons";

    let resultsEventIndex: number;

    let historyIndex: number;

    export let data;
</script>

<svelte:head>
    <title>User's name</title>
</svelte:head>

<div class="container-grid">
    <div class="user-container">
        <Card width={300} clickable={false}>
            <div style:padding=16px>
                <div class="section-column">
                    <h3 style:font-weight=500 class="fsize-title2">User's name</h3>

                    <Badge 
                        size={BadgeSize.Regular} 
                        fg=var(--c-g)
                        bg=var(--c-lgh)
                        label="User's Region"/>

                    <Badge 
                        size={BadgeSize.Regular} 
                        fg=var(--c-a)
                        bg=var(--c-la1)
                        label="ASC Club Organiser"/>
                </div>

                <div class="card-column" style:margin-top=32px>
                    <div class="section-column">
                        <div class="data-row">
                            <p style:font-weight=500> XXX </p>
                            <p> Meetups Attended </p>
                        </div>

                        <div class="data-row">
                            <p style:font-weight=500> XXX </p>
                            <p> Completed Solves </p>
                        </div>
                    </div>

                    <hr>

                    <div class="section-column">
                        <!-- INFO: gold -->
                        <div class="data-row">
                            <div class="medal-container">
                                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height=16 stroke-width=1.5 fill=#F9D953 stroke=#EFCC3A>
                                    <circle cx="8" cy="8" r="6.75" />
                                </svg>

                                <p class="medal-text">1</p>
                            </div>

                            <p style:font-weight=500> XXX </p>
                            <p> Gold Medals </p>
                        </div>

                        <!-- INFO: silver -->
                        <div class="data-row">
                            <div class="medal-container">
                                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height=16 stroke-width=1.5 fill=#D3D3D3 stroke=#C4C4C4>
                                    <circle cx="8" cy="8" r="6.75" />
                                </svg>

                                <p class="medal-text">2</p>
                            </div>

                            <p style:font-weight=500> XXX </p>
                            <p> Silver Medals </p>
                        </div>

                        <!-- INFO: bronze -->
                        <div class="data-row">
                            <div class="medal-container">
                                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height=16 stroke-width=1.5 fill=#F89656 stroke=#E47D43>
                                    <circle cx="8" cy="8" r="6.75" />
                                </svg>

                                <p class="medal-text">3</p>
                            </div>

                            <p style:font-weight=500> XXX </p>
                            <p> Bronze Medals </p>
                        </div>
                    </div>

                    <hr>

                    <div class="section-column">
                        <!-- INFO: RR -->
                        <div class="data-row">
                            <Badge size={BadgeSize.Small} bg=var(--c-lgreen) fg=var(--c-green) label=RR/>

                            <p style:font-weight=500> XXX </p>
                            <p> Regional Records </p>
                        </div>

                        <!-- INFO: IR -->
                        <div class="data-row">
                            <Badge size={BadgeSize.Small} bg=var(--c-lred) fg=var(--c-red) label=IR/>

                            <p style:font-weight=500> XXX </p>
                            <p> Island Records </p>
                        </div>


                        <!-- INFO: IcR -->
                        <div class="data-row">
                            <Badge size={BadgeSize.Small} bg=var(--c-lpurple) fg=var(--c-purple) label=IcR/>

                            <p style:font-weight=500> XXX </p>
                            <p> Interclub Records </p>
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


                <tr>
                    <td class="tc-dummy"></td>

                    <td class="tc-event">3x3 Multiple Blindfolded</td>
                    <td class="tc-rr">14</td>
                    <td class="tc-ir">17</td>
                    <td class="tc-icr">22</td>
                    <td class="tc-result">8.17</td>

                    <td class="tc-result">9.78</td>
                    <td class="tc-icr">23</td>
                    <td class="tc-ir">17</td>
                    <td class="tc-rr">14</td>

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
                    <td></td>
                    <td></td>
                </tr>
            </table>
        </div>


        <div class="history-section">
            <TabBar labels={["Results History", "Records History"]} bind:selectedIndex={historyIndex} />

            {#if historyIndex == 0}
                <MultiButton bind:selectedIndex={resultsEventIndex} padding={4} labels={[
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

    .card-column {
        flex-direction: column;
        row-gap: 12px;
    }

    .data-row {
        flex-direction: row;
        align-items: center;
        column-gap: 12px;
    }


    .medal-container {
        display: grid;
        align-items: center;
        justify-items: center;
    }

    .medal-text {
        grid-area: 1/1;
        position: absolute;
        z-index: 2;
        font-weight: 600;
        font-size: 10px;
        color: white;
    }

    hr {
        border: none;
        border-bottom: 1.5px solid var(--c-lg1);
        height: 1.5px;

        width: 100%;
    }


    .container-grid {
        display: grid;
        width: 1000px;
        margin-left: auto;
        margin-right: auto;

        margin-top: 126px; /* tab bar + 32px either side */
        grid-template-columns: 300px 1fr;

        column-gap: 16px;
    }


    .user-container {
        grid-column: 1;
    }

    .content {
        grid-column: 2;

        display: flex;
        flex-direction: column;
        row-gap: 48px;
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
