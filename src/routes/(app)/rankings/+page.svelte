<script lang="ts">
    import { Region } from "@prisma/client";

    interface Result {
        ranking: number;
        name: string;
        result: number;
        region: Region;
        meetupName: string;
        data: any;
    }

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
    ];
</script>

<div class="content"> 
    <h1 class="fstyle-heading" style:padding-bottom=8px>Rankings</h1>

    <h3 class="fstyle-subheading" style:padding-bottom=32px>Rankings shown are for all solves done at meetups and are not grouped by age or gender.</h3>


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
</div>




<style>
    .content {
        width: 1000px;
        margin-left: auto;
        margin-right: auto;

        margin-top: 126px; /* tab bar + 32px either side */
    }


    table {
        width: 1000px;
        border-radius: var(--srad);
        border: 1px var(--clg1) solid;
        background-color: white;

        border-spacing: 0;
    }

    table * {
        font-size: 14px;
    }

    tr {
        height: 30px;
    }

    tr:nth-child(odd):not(:first-child):not(:last-child) td:not(:first-child):not(:last-child) {
        background-color: #D1D3D640;
    }

    th {
        color: var(--cdg1);
        font-weight: 500;

        border-bottom: 1px var(--clg1) solid;
    }

    td:not(:first-child):not(:last-child), th:not(:first-child):not(:last-child) {
        /* = 24px gap total between columns */
        padding-left: 6px;
        padding-right: 6px;
    }

    .td-dummy {
        height: 8px;
        background-color: white;
    }


    td:nth-last-child(2) {
        border-top-right-radius: var(--srad-l);
        border-bottom-right-radius: var(--srad-l);
    }

    td:nth-child(2) {
        border-top-left-radius: var(--srad-l);
        border-bottom-left-radius: var(--srad-l);

    }


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

    .tc-dummy {
        width: 8px;
        background-color: white;
    }

    .tc-result, .tc-ranking {
        text-align: right;
    }

    .tc-ranking {
        color: var(--cdg1);
    }

    .tc-result, .tc-region, .tc-meetup, .tc-solves {
        width: fit-content;
    }
</style>
