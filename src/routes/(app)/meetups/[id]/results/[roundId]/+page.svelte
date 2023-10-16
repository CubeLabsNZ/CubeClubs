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
    import Table, { DisplayType } from '$lib/components/global/Table.svelte';
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
</script>

<TabBar
    labels={["Info", "Competitors", "Schedule & Results"]}
    bind:selectedIndex={tabIndex}>
</TabBar>

<div class="content">
    <Breadcrumb paths={[
        {name: "Schedule", href: `/meetups/${data.meetupId}/schedule`}
    ]} />

    <h3 class="fsize-title2" style:font-weight=500 style:margin-top=8px style:margin-bottom=8px>{getRoundName(puzzles[data.round.puzzle].name, data.round.round_number, data.round.round_maximum)} Results</h3>

    {#if data.round.results.length}
        {@const firstres = data.round.results[0]}
        {@const ismbld = Boolean(firstres.mbld_score)}
        {@const isfmc = data.round.puzzle == "FMC"}

        <Table
                list={data.round.results}
                solveCount={formats[data.round.format].count}
                displayRank={true}
                displayMedals={data.round.round_number === data.round.round_maximum}
                proceedNum={data.round.proceed_number}
                showBest={true}
                hasSolves={!ismbld}
                displayType={ismbld ? DisplayType.SINGLE : DisplayType.AVERAGE}
                widths={["48px"]}
                {isfmc}
            />
    {:else}
        <p>No results yet - check back later!</p>
    {/if}
</div>

<style>
    .content {
        margin-top: 16px;
    }
</style>
