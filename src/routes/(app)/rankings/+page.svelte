<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    import regions from "$lib/data/regions";

    import { Region } from "@prisma/client";

    import SegmentedControl, { LabelType } from "$lib/components/SegmentedControl.svelte";


    import DetailPage from "$lib/components/DetailPage.svelte";


    import * as Icons from "$lib/assets/cube-icons/icons";


    interface Result {
        ranking: number;
        name: string;
        result: number;
        region: Region;
        meetupName: string;
        data: any;
    }


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

    let formatIndex: number, eventIndex: number;
    let regionSelected: string;


    let results: Result[] = [
        { ranking: 1, name: "John Doe", result: 1.67, region: Region.AUCKLAND, meetupName: "ASC Meetup April 2023", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 2, name: "Joe Bloggs", result: 1.78, region: Region.OTAGO, meetupName: "Christchurch Meetups", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 1, name: "John Doe", result: 1.67, region: Region.AUCKLAND, meetupName: "ASC Meetup April 2023", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 1, name: "John Doe", result: 1.67, region: Region.AUCKLAND, meetupName: "ASC Meetup April 2023", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 1, name: "John Doe", result: 1.67, region: Region.AUCKLAND, meetupName: "ASC Meetup April 2023", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 1, name: "John Doe", result: 1.67, region: Region.AUCKLAND, meetupName: "ASC Meetup April 2023", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 2, name: "Joe Bloggs", result: 1.78, region: Region.OTAGO, meetupName: "Christchurch Meetups", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 2, name: "Joe Bloggs", result: 1.78, region: Region.OTAGO, meetupName: "Christchurch Meetups", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 2, name: "Joe Bloggs", result: 1.78, region: Region.OTAGO, meetupName: "Christchurch Meetups", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 2, name: "Joe Bloggs", result: 1.78, region: Region.OTAGO, meetupName: "Christchurch Meetups", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 1, name: "John Doe", result: 1.67, region: Region.AUCKLAND, meetupName: "ASC Meetup April 2023", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 2, name: "Joe Bloggs", result: 1.78, region: Region.OTAGO, meetupName: "Christchurch Meetups", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 1, name: "John Doe", result: 1.67, region: Region.AUCKLAND, meetupName: "ASC Meetup April 2023", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 1, name: "John Doe", result: 1.67, region: Region.AUCKLAND, meetupName: "ASC Meetup April 2023", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 1, name: "John Doe", result: 1.67, region: Region.AUCKLAND, meetupName: "ASC Meetup April 2023", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 1, name: "John Doe", result: 1.67, region: Region.AUCKLAND, meetupName: "ASC Meetup April 2023", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 2, name: "Joe Bloggs", result: 1.78, region: Region.OTAGO, meetupName: "Christchurch Meetups", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 2, name: "Joe Bloggs", result: 1.78, region: Region.OTAGO, meetupName: "Christchurch Meetups", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 2, name: "Joe Bloggs", result: 1.78, region: Region.OTAGO, meetupName: "Christchurch Meetups", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
        { ranking: 2, name: "Joe Bloggs", result: 1.78, region: Region.OTAGO, meetupName: "Christchurch Meetups", data: "1.54, 1.64, 1.45, 1.90, 1.24" },
    ];


    $: updateQuery(formatIndex, eventIndex, regionSelected);

    function updateQuery(formatIndex: number, eventIndex: number, selectedRegion: string) {
        if (!browser) { return }

        let query = new URLSearchParams($page.url.searchParams.toString());

        query.set("format", formatIndex ? "average" : "single");

        query.set("event", String(eventIndex));

        console.log($page.url.searchParams);

        if (selectedRegion == "") {
            query.delete("region")
        } else {
            query.set("region", selectedRegion);
        }

        goto(`?${query.toString()}`);
    }

    console.log(Icons.Icon2);
</script>


<DetailPage 
    heading="Rankings"
    subheading="Rankings shown are for all solves done at meetups and are not grouped by age or gender.">  

    <div class="filter-bar">
        <div class="label-group">
            <p class="label">Format</p>

            <SegmentedControl bind:selectedIndex={formatIndex} labels={[
                {type: LabelType.Text, data: "Single"},
                {type: LabelType.Text, data: "Average"}
            ]} /> 
        </div>


        <div class="label-group">
            <p class="label">Region</p>
            
            <select name="region" bind:value={regionSelected}>
                <option selected value>All Regions</option>
                {#each Object.entries(regions) as [value, {name, maori_name}] }
                    <option value={value}>{name} {maori_name !== undefined ? `(${maori_name})` : ""}</option>
                {/each}
            </select>
        </div>
    </div>

    <div class="filter-bar">
        <div class="label-group">
            <p class="label">Event</p>

            <SegmentedControl bind:selectedIndex={eventIndex} labels={[
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
            ]}>  </SegmentedControl>
        </div>
    </div>


    <table>
        <!-- NOTE: tc-dummy is entirely invisible to provide padding to either side of the table -->
        <tr>
            <th class="tc-dummy"></th>

            <th class="tc-ranking"></th>
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


        {#each results as { ranking, name, result, region, meetupName, data} }
            <tr>
                <td class="tc-dummy"></td>

                <td class="tc-ranking">{ranking}</td>
                <td class="tc-name">{name}</td>
                <td class="tc-result">{result}</td>
                <td class="tc-region">{region}</td>
                <td class="tc-meetup">{meetupName}</td>
                <td class="tc-solves">{data}</td>

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
        </tr>
    </table>
    
</DetailPage>



<style>
    .tc-name, .tc-region, .tc-meetup, .tc-solves {
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

    .tc-result, .tc-ranking {
        text-align: right;
    }

    .tc-ranking {
        color: var(--cdg1);
    }

    .filter-bar {
        padding-bottom: 8px;
    }

    .filter-bar:last-of-type {
        padding-bottom: 16px;
    }
</style>
