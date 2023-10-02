<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    import regions, {regionToString} from "$lib/data/regions";

    import { puzzle, region } from "@prisma/client";

    import MultiButton, { LabelType } from "$lib/components/global/MultiButton.svelte";
    import Select from "$lib/components/global/Select.svelte";


    import PageContent from "$lib/components/global/PageContent.svelte";

    import { formatTime } from "$lib/utils"

    import type { PageData } from "./$types"
    import puzzles from "$lib/data/puzzles";
    import formats from "$lib/data/formats";
    import Table, { DisplayType } from "$lib/components/global/Table.svelte";

    export let data: PageData

    // INFO: format: 0 = single, 1 - average

    let formatIndex: number;
    let regionSelected: string
    let eventSelected: string;

    // TODO: make stupid multibutton more fleible than just stupid index stupid
    let eventIndex = $page.url.searchParams.has("event") ? Object.keys(puzzles).indexOf($page.url.searchParams.get("event")) : 0


// TODO: make this good and all backend 
    $: {
        eventSelected = Object.keys(puzzles)[eventIndex];
        console.log("EVENT INDEX IS " + eventIndex)
        console.log("EVENT SELECTED IS NOW " + eventSelected)

        updateQuery(formatIndex, eventSelected, regionSelected);

    }

    async function updateQuery(formatIndex: number, selectedEvent: string, selectedRegion: string) {
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

    <Table
        list={data.results}
            displayType={data.isSingle ? DisplayType.SINGLE : DisplayType.AVERAGE}
            hasMeetup={true}
            hasSolves={!data.isSingle}
            displayRank={true}
            widths={["50px", "160px", "80px", "80px", "auto"]}
    />

</PageContent>



<style>
    .filter-bar {
        padding-bottom: 8px;
    }

    .filter-bar:last-of-type {
        padding-bottom: 16px;
    }
</style>
