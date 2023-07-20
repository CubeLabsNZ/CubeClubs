<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    import regions from "$lib/data/regions";
    import puzzles from "$lib/data/puzzles";

    import { Region } from "@prisma/client";

    import DetailPage from "$lib/components/DetailPage.svelte";

    import SegmentedControl, { LabelType } from "$lib/components/SegmentedControl.svelte";


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

    let results: Result[] = [
        { name: "John Doe", result: 1.67, region: Region.AUCKLAND, meetupName: "ASC Meetup April 2023", data: "" },
        { name: "Joe Bloggs", result: 1.78, region: Region.OTAGO, meetupName: "Christchurch Meetups", data: "1.54, 1.64, 1.45, 1.90, 1.24" }
    ];

</script>


<DetailPage
    heading="Records"
    subheading="Records shown are for all records broken at meetups and are not grouped by age or gender.">

    <div class="filter-bar">
        <div class="label-group">
            <p class="label">Region</p>

            <select name="region" bind:value={regionSelected}>
                <option selected value>All Regions</option>
                {#each Object.entries(regions) as [value, {name, maori_name}] }
                    <option value={value}>{name} {maori_name !== undefined ? `(${maori_name})` : ""}</option>
                {/each}
            </select>
        </div>

        <div class="label-group">
            <p class="label">Show</p>

            <SegmentedControl bind:selectedIndex={displayType} labels={[
                {type: LabelType.Text, data: "Current"},
                {type: LabelType.Text, data: "History"}
            ]} /> 
        </div>
    </div>


    {#each Object.entries(puzzles) as [puzzle, { name, icon }], i}
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

            <!-- INFO: single -->
            <tr>
                <td class="tc-dummy"></td>

                <td class="tc-type">Single</td>
                <td class="tc-name">{results[0].name}</td>
                <td class="tc-result">{results[0].result}</td>
                <td class="tc-region">{results[0].region}</td>
                <td class="tc-meetup">{results[0].meetupName}</td>
                <td class="tc-solves">{results[0].data}</td>

                <td class="tc-dummy"></td>
            </tr>


            <!-- INFO: average-->
            <tr>
                <td class="tc-dummy"></td>

                <td class="tc-type">Average</td>
                <td class="tc-name">{results[1].name}</td>
                <td class="tc-result">{results[1].result}</td>
                <td class="tc-region">{results[1].region}</td>
                <td class="tc-meetup">{results[1].meetupName}</td>
                <td class="tc-solves">{results[1].data}</td>

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
    {/each}
</DetailPage>


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

    tr:not(:first-child) .tc-name,
    tr:not(:first-child) .tc-meetup {
        color: var(--ca);
    }

    .tc-result {
        text-align: right;
    }

    .tc-type {
        color: var(--cdg1);
    }

    .filter-bar {
        padding-bottom: 32px;
    }
</style>
