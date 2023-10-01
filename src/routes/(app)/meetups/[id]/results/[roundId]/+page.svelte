<script lang="ts">
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';

    import puzzles from "$lib/data/puzzles";
    import formats from "$lib/data/formats";
    import regions, { regionToString } from "$lib/data/regions";

    import { getRoundName, formatTime } from "$lib/utils";

    import TabBar from '$lib/components/global/TabBar.svelte';
    import Breadcrumb from '$lib/components/global/Breadcrumb.svelte';
    import Medal, { PodiumPlace } from '$lib/components/user/Medal.svelte';
    export let data;

    let locations = ["info", "competitors", "results"]
    let tabIndex = 2;

    $: {
        if (browser) {
            if (tabIndex != 2) {
                goto(`/meetups/${data.meetupId}/` + locations[tabIndex], { replaceState: true })
            }
        }
    }

    const currentRound = data.rounds.find(r => r.id === data.roundId)!;

    console.log(currentRound);
    console.log(formats[currentRound.format].count)
</script>

<TabBar
    labels={["Info", "Competitors", "Schedule & Results"]}
    bind:selectedIndex={tabIndex}>
</TabBar>

<div class="content">
    <Breadcrumb paths={[
        {name: "Back to Schedule", href: `/meetups/${data.meetupId}/schedule`}
    ]} />

    <h3 class="fsize-title2" style:font-weight=500 style:margin-top=8px style:margin-bottom=8px>{getRoundName(puzzles[currentRound.puzzle].name, currentRound.number, data.maxRounds[currentRound.puzzle])} Results</h3>

    {#if currentRound.results.length}
        {@const firstres = currentRound.results[0]}
        {@debug firstres}
        <table>
            <tr>

                <th class="tc-ranking"></th>
                <th class="tc-name">Name</th>
                <th class="tc-average">Average</th>
                <th class="tc-best">Best</th>
                <th class="tc-region">Region</th>
                <!-- TODO: depends on if ao5, mo3, single... -->
                {#each Array(formats[currentRound.format].count) as _, i}
                    <th class="tc-solves">{i + 1}</th>
                {/each}

            </tr>


            {#each currentRound.results as { value, solves, user_id, user_name, user_region }, rank}
                <tr>

                    <!-- if final round -->
                    {#if currentRound.number === data.maxRounds[currentRound.puzzle]}
                        <!-- TODO: error checking? -->
                        {#if rank < 3 && value != Infinity}
                            <td class="tc-ranking">
                                <div style:float=right>
                                    <Medal place={rank} /> 
                                </div>
                            </td>
                        {:else}
                            <td class="tc-ranking">
                                <p style:margin-right=4px> {rank + 1} </p> 
                            </td>
                        {/if}
                    {:else}
                        <td class="tc-ranking" data-proceed={(rank < currentRound.proceed_number ?? 0) && value != Infinity}> {rank + 1} </td>
                    {/if}

                    <!-- TODO: make link -->
                    <td class="tc-name">{user_name}</td>
                    <td class="tc-average">{formatTime(value)}</td>
                    <td class="tc-best">{formatTime(Math.min(...solves))}</td>
                    <td class="tc-region">{regionToString(user_region)}</td>

                    {#each solves as time}
                        <td class="tc-solves">{formatTime(time)}</td>
                    {/each}

                </tr>
            {/each}
        </table>
    {:else}
        <p>No results yet - check back later!</p>
    {/if}
</div>

<style>
    .content {
        margin-top: 16px;
    }

    /* Use border instead of padding: padding will use background color */
    tr:nth-child(2) td {
        border-top: solid 8px white;
    }

    tr:last-child td {
        border-bottom: solid 8px white;
    }

    td:first-child, th:first-child {
        border-left: solid 6px white;
    }

    td:last-child, th:last-child {
        border-right: solid 6px white;
    }

    td, th {
        padding-top: 5px;
        padding-bottom: 4px;
    }

    .tc-name, .tc-region, .tc-solves {
        text-align: left;
    }

    .tc-name {
        min-width: 200px;
    }

    .tc-average, .tc-name {
        font-weight: 500;
    }

    tr:not(:first-child) .tc-name {
        color: var(--c-a);
    }

    .tc-average, .tc-best, .tc-ranking {
        text-align: right;
    }

    .tc-ranking {
        color: var(--c-dg1);
    }

    .tc-ranking[data-proceed=true] {
        color: var(--c-green);
        font-weight: 600;
    }
</style>
