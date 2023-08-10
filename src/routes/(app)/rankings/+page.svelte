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

    import * as Icons from "$lib/assets/cube-icons/icons";

    import type { PageData } from "./$types"
    import puzzles from "$lib/data/puzzles";

    export let data: PageData

    /* INFO:
        format: 0 = single, 1 - average

        event:
            0 = 3x3
            1-5 = 2x2, 4x4-7x7
            6 = squan
            7 = skewb
            8 = pyra
            9 = mega
            10 = oh
            11 = clock
            12 = fmc
            13 = 3bld
            14 = mbld
            15 = 4bld
            16 = 5bld
    */

    let formatIndex: number;
    let regionSelected: string
    let eventSelected: string;
    // TODO: make stupid multibutton more fleible than just stupid index stupid
    let eventIndex = 0;
    $: eventSelected = Object.keys(puzzles)[eventIndex];

    $: updateQuery(formatIndex, eventSelected, regionSelected);

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
            <p class="label">Format</p>

            <MultiButton bind:selectedIndex={formatIndex} labels={[
                {type: LabelType.Text, data: "Single"},
                {type: LabelType.Text, data: "Average"}
            ]} /> 
        </div>


        <div class="label-group">
            <p class="label">Region</p>

            <Select name="region" bind:value={regionSelected}>
                <option selected value>All Regions</option>
                {#each Object.keys(regions) as value }
                    <option value={value}>{regionToString(value)}</option>
                {/each}
            </Select>
        </div>
    </div>

    <div class="filter-bar">
        <div class="label-group">
            <p class="label">Event</p>

            <MultiButton bind:selectedIndex={eventIndex} padding={4} fixedHeight={false} labels={[
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
        </div>
    </div>


    <table>
        <colgroup>
            <col span=1 style:width=8px>

            <col span=1 style:width=50px>
            <col span=1 style:width=160px>
            <col span=1 style:width=80px>
            <col span=1 style:width=160px>
            <col span=1 style:width=auto>

            {#if formatIndex}
                <col span=1 style:width=auto>
            {/if}

                <col span=1 style:width=8px>
        </colgroup>

        <tbody>
            <!-- NOTE: tc-dummy is entirely invisible to provide padding to either side of the table -->
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

            <!-- NOTE: td-dummy is entirely invisible to provide padding to the top and bottom of the table -->
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
                    {#each data.average?.results as average, i }
                        <tr>
                            <td class="tc-dummy"></td>

                            <td class="tc-ranking">{i + 1}</td>
                            <td class="tc-name"><a class="regular-link" href={`/user/${average.user.id}`}>{average.user.name}</a></td>
                            <td class="tc-result">{formatTime(average.value)}</td>
                            <td class="tc-region">{regionToString(average.user.region)}</td>
                            <td class="tc-meetup"><a class="regular-link" href={`/meetups/${average.round.meetup.id}`}>{average.round.meetup.name}</a></td>

                            {#each average.solves as solve }
                                <td class="tc-solves">{formatTime(solve.time)}</td>
                            {/each}

                            <td class="tc-dummy"></td>
                        </tr>
                    {/each}
                {:else}
                    {#each data.results.single.allregions[Puzzle.THREE] as single, i }
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
