<script lang="ts" context="module">
    export enum DisplayType {
        AVERAGE,
        SINGLE,
        MIX,
    }
</script>

<script lang="ts">
    import type { region } from "$lib/db/enums";
    import Medal from "$lib/components/user/Medal.svelte";
    import { formatTime } from "$lib/utils";
    import { regionToString } from "$lib/data/regions";

    export let list: {
        value: number | undefined;
        time: number | undefined;
        solves: number[] | undefined;
        user_id: number | undefined;
        user_name: string | undefined;
        user_region: region | undefined;
    }[];
    export let solveCount: number | undefined = undefined;

    export let displayRank: boolean;
    export let displayMedals: boolean = false;
    export let proceedNum: number = 0;
    export let showBest: boolean = false;
    export let hasSolves: boolean = true;
    export let hasMeetup: boolean = false;
    export let showUser: boolean = true;
    export let meetupAndRoundLeft: boolean = false

    export let displayType: DisplayType;

    export let widths: string[] | undefined;
</script>

<table>
    {#if widths}
        <colgroup>
            {#each widths as width}
                <col span="1" style:width />
            {/each}
        </colgroup>
    {/if}
    <tr>
        {#if displayType == DisplayType.MIX}
            <th class="tc-type">Format</th>
        {/if}
        {#if displayRank}
            <th class="tc-ranking" />
        {/if}
        {#if showUser}
            <th class="tc-name">Name</th>
        {/if}
        <th class="tc-result"
            >{(() => {
                switch (displayType) {
                    case DisplayType.AVERAGE:
                        return "Average";
                    case DisplayType.SINGLE:
                        return "Time";
                    case DisplayType.MIX:
                        return "Result";
                }
            })()}</th
        >
        {#if showBest}
            <th class="tc-best">Best</th>
        {/if}

        {#if showUser}
            <th class="tc-region">Region</th>
        {/if}

        {#if hasMeetup}
            <th class="tc-meetup">Meetup</th>
        {/if}

        <!-- TODO: depends on if ao5, mo3, single... -->
        {#if hasSolves}
            {#if solveCount}
                {#each Array(solveCount) as _, i}
                    <th class="tc-solves">{i + 1}</th>
                {/each}
            {:else}
                <th class="tc-solves">Solves</th>
            {/if}
        {/if}
    </tr>

    {#each list as list_item, rank}
        <tr>
            {#if typeof list_item === "undefined"}
                <td class="tc-placeholder" align="center" colspan="6"
                    >no results yet</td
                >
            {:else}
                {@const {
                    value,
                    time,
                    solves,
                    meetup_id,
                    meetup_name,
                    user_id,
                    user_name,
                    user_region,
                } = list_item}
                {#if displayType == DisplayType.MIX}
                    <td class="tc-type">{solves ? "Average" : "Single"}</td>
                {/if}
                {#if displayRank}
                    {@const t = value ?? time}
                    {@const prevT =
                        list[rank - 1]?.value ?? list[rank - 1]?.time}
                    {@const isTie = t == prevT}
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
                                <p style:margin-right="4px">
                                    {isTie ? "-" : rank + 1}
                                </p>
                            </td>
                        {/if}
                    {:else}
                        <td
                            class="tc-ranking"
                            data-proceed={rank < proceedNum &&
                                value != Infinity}
                        >
                            {isTie ? "-" : rank + 1}
                        </td>
                    {/if}
                {/if}

                {#if showUser}
                <td class="tc-name"
                    ><a class="regular-link" href={`/user/${user_id}`}
                        >{user_name}</a
                    ></td
                >
                {/if}
                <td class="tc-result">{formatTime(value ? value : time)}</td>
                {#if showBest}
                    <td class="tc-best">{formatTime(Math.min(...solves))}</td>
                {/if}
                {#if showUser}
                    <td class="tc-region">{regionToString(user_region)}</td>
                {/if}

                {#if hasMeetup}
                    <td class="tc-meetup"
                        ><a class="regular-link" href={`/meetups/${meetup_id}`}
                            >{meetup_name}</a
                        ></td
                    >
                {/if}

                {#if hasSolves}
                    {#if solves}
                        {#if solveCount}
                            {#each solves as time}
                                <td class="tc-solves">{formatTime(time)}</td>
                            {/each}
                        {:else}
                            <td class="tc-solves"
                                >{solves
                                    .map((s) => formatTime(s))
                                    .join(", ")}</td
                            >
                        {/if}
                    {:else}
                        <td class="tc-solves" />
                    {/if}
                {/if}
            {/if}
        </tr>
    {/each}
</table>

<style>
    /* TODO: if we ever do sass, this code is first to use the features */
    /* Top */
    tr:nth-of-type(2) td {
        padding-top: calc(8px + 5.75px);
        clip-path: inset(8px 0 0 0);
    }

    /* Bottom */
    tr:last-child td {
        padding-bottom: calc(8px + 5.75px);
        clip-path: inset(0 0 8px 0);
    }

    /* Left */
    th:first-child {
        padding-left: calc(6px + 8.75px);
    }

    td:first-child {
        padding-left: calc(6px + 8.75px);
        clip-path: inset(
            0 0 0 8.75px round var(--v-border-radius-small) 0 0
                var(--v-border-radius-small)
        );
    }
    /* Right */
    td:last-child {
        padding-right: calc(6px + 8.75px);
        clip-path: inset(
            0 8.75px 0 0 round 0 var(--v-border-radius-small)
                var(--v-border-radius-small) 0
        );
    }

    /* Top Left */
    tr:nth-of-type(2) td:first-child {
        clip-path: inset(
            8px 0 0 8.75px round var(--v-border-radius-small) 0 0
                var(--v-border-radius-small)
        );
    }
    /* Top Right */
    tr:nth-of-type(2) td:last-child {
        clip-path: inset(
            8px 8.75px 0 0 round 0 var(--v-border-radius-small)
                var(--v-border-radius-small) 0
        );
    }
    /* Bottom Right */
    tr:last-child td:last-child {
        clip-path: inset(
            0 8.75px 8px 0 round 0 var(--v-border-radius-small)
                var(--v-border-radius-small) 0
        );
    }
    /* Bottom Left */
    tr:last-child td:first-child {
        clip-path: inset(
            0 0 8px 8.75px round var(--v-border-radius-small) 0 0
                var(--v-border-radius-small)
        );
    }

    /* Special cases: 1 element */
    tr:nth-of-type(2):last-child td {
        clip-path: inset(8px 0 8px 0);
    }
    /* Left side */
    tr:nth-of-type(2):last-child td:first-child {
        clip-path: inset(
            8px 0 8px 8.75px round var(--v-border-radius-small) 0 0
                var(--v-border-radius-small)
        );
    }
    /* Right side */
    tr:nth-of-type(2):last-child td:last-child {
        clip-path: inset(
            8px 8.75px 8px 0 round 0 var(--v-border-radius-small)
                var(--v-border-radius-small) 0
        );
    }

    tr:nth-of-type(even) td {
        background-color: var(--c-lgh);
    }

    td,
    th {
        padding-top: 5.75px;
        padding-bottom: 5.75px;
    }

    .tc-name,
    .tc-region,
    .tc-solves,
    .tc-meetup,
    .tc-type {
        text-align: left;
    }

    .tc-name {
        min-width: 200px;
    }

    .tc-result,
    .tc-name {
        font-weight: 500;
    }

    tr:not(:first-of-type) .tc-name {
        color: var(--c-a);
    }

    .tc-result,
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
