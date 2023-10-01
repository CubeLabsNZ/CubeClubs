<script lang="ts">
    import type { region } from "$lib/db/enums";
    import Medal from "$lib/components/user/Medal.svelte";
    import { formatTime } from "$lib/utils";
    import { regionToString } from "$lib/data/regions";

    export let list: {
        value: number,
        solves: {time: number}[] | undefined,
        user_id: number,
        user_name: string,
        user_region: region,
    }[]
    export let solveCount: number | undefined

    export let displayRank: boolean
    export let displayMedals: boolean
    export let proceedNum: number = 0
</script>

<table>
    <tr>
        {#if displayRank}
            <th class="tc-ranking" />
        {/if}
        <th class="tc-name">Name</th>
        <th class="tc-average">Average</th>
        <th class="tc-best">Best</th>
        <th class="tc-region">Region</th>
        <!-- TODO: depends on if ao5, mo3, single... -->
        {#each Array(solveCount) as _, i}
            <th class="tc-solves">{i + 1}</th>
        {/each}
    </tr>

    {#each list as { value, solves, user_id, user_name, user_region }, rank}
        <tr>
            <!-- if final round -->
            {#if displayMedals}
                <!-- TODO: error checking? -->
                {#if rank < 3 && value != Infinity}
                    <td class="tc-ranking">
                        <div style:float="right">
                            <Medal place={rank} />
                        </div>
                    </td>
                {:else}
                    <td class="tc-ranking">
                        <p style:margin-right="4px">{rank + 1}</p>
                    </td>
                {/if}
            {:else}
                <td
                    class="tc-ranking"
                    data-proceed={(rank < proceedNum) &&
                        value != Infinity}
                >
                    {rank + 1}
                </td>
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

<style>

    /* TODO: if we ever do sass, this code is first to use the features */
    /* Top */
    tr:nth-child(2) td {
        padding-top: calc(8px + 5.75px);
        clip-path: inset(8px 0 0 0);
    }

    /* Bottom */
    tr:last-child td {
        padding-bottom: calc(8px + 5.75px);
        clip-path: inset(0 0 8px 0);
    }

    /* Left */
    td:first-child {
        padding-left: calc(6px + 8.75px);
        clip-path: inset(0 0 0 8.75px round var(--v-border-radius-small) 0 0 var(--v-border-radius-small));
    }
    /* Right */
    td:last-child {
        padding-right: calc(6px + 8.75px);
        clip-path: inset(0 8.75px 0 0 round 0 var(--v-border-radius-small) var(--v-border-radius-small) 0);
    }

    /* Top Left */
    tr:nth-child(2) td:first-child {
        clip-path: inset(8px 0 0 8.75px round var(--v-border-radius-small) 0 0 var(--v-border-radius-small));
    }
    /* Top Right */
    tr:nth-child(2) td:last-child {
        clip-path: inset(8px 8.75px 0 0 round 0 var(--v-border-radius-small) var(--v-border-radius-small) 0);
    }
    /* Bottom Right */
    tr:last-child td:last-child {
        clip-path: inset(0 8.75px 8px 0 round 0 var(--v-border-radius-small) var(--v-border-radius-small) 0);
    }
    /* Bottom Left */
    tr:last-child td:first-child {
        clip-path: inset(0 0 8px 8.75px round var(--v-border-radius-small) 0 0 var(--v-border-radius-small));
    }

    tr:nth-child(even) td {
        background-color: var(--c-lgh);
    }

    td,
    th {
        padding-top: 5.75px;
        padding-bottom: 5.75px;
    }

    .tc-name,
    .tc-region,
    .tc-solves {
        text-align: left;
    }

    .tc-name {
        min-width: 200px;
    }

    .tc-average,
    .tc-name {
        font-weight: 500;
    }

    tr:not(:first-child) .tc-name {
        color: var(--c-a);
    }

    .tc-average,
    .tc-best,
    .tc-ranking {
        text-align: right;
    }

    .tc-ranking {
        color: var(--c-dg1);
    }

    .tc-ranking[data-proceed="true"] {
        color: var(--c-green);
        font-weight: 600;
    }
</style>
