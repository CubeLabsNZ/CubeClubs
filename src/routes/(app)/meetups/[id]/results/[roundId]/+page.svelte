<script lang="ts">
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';

    import puzzles from "$lib/data/puzzles";
    import formats from "$lib/data/formats";
    import regions from "$lib/data/regions";

    import { getRoundName } from "$lib/utils";

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

    const currentRound = data.rounds.find(r => r.id === Number(data.roundId));

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

    <table>
        <tr>
            <th class="tc-dummy"></th>

            <th class="tc-ranking"></th>
            <th class="tc-name">Name</th>
            <th class="tc-average">Average</th>
            <th class="tc-best">Best</th>
            <th class="tc-region">Region</th>
            <!-- TODO: depends on if ao5, mo3, single... -->
            {#each Array(formats[currentRound.format].count) as _, i}
                <th class="tc-solves">{i + 1}</th>
            {/each}

            <th class="tc-dummy"></th>
        </tr>

        <tr class="td-dummy">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>

            {#each Array(formats[currentRound.format].count) as _}
                <td></td>
            {/each}

            <td></td>
        </tr>


        {#each currentRound.results as { value, solves, user }, rank}
            <tr>
                <td class="tc-dummy"></td>

                <!-- if final round -->
                {#if currentRound.number === data.maxRounds[currentRound.puzzle]}
                    <!-- TODO: error checking? -->
                    {#if rank < 3}
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
                    <td class="tc-ranking" data-proceed={rank < currentRound.proceedNumber ?? 0}> {rank + 1} </td>
                {/if}

                <td class="tc-name">{user.name}</td>
                <td class="tc-average">{value}</td>
                <td class="tc-best">{Math.min(...solves.map(s => s.time))}</td>
                <td class="tc-region">{user.region}</td>

                {#each solves as { time }}
                    <td class="tc-solves">{time}</td>
                {/each}

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

            {#each Array(formats[currentRound.format].count) as _, i}
                <td></td>
            {/each}

            <td></td>
        </tr>
    </table>
</div>

<style>
    .content {
        margin-top: 16px;
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
