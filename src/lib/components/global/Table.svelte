<script lang="ts" context="module">
    export enum DisplayType {
        AVERAGE,
        SINGLE,
        MIX,
    }

    export enum MixDisplayMethod {
        FormatColumn,
        SeparateAverageAndSingle,
    }
</script>

<script lang="ts">
    interface li {
        value: number | undefined;
        time: number | undefined;
        solves: number[] | undefined;
        meetup_id: number | undefined;
        meetup_name: string | undefined;
        user_id: number | undefined;
        user_name: string | undefined;
        user_region: Region | undefined;
        cum_min: number | undefined;
        date: Date | undefined;

        mbld_score: number | undefined;
        mbld_total: number | undefined;

        is_average_pr: boolean | undefined;
        is_average_icr: boolean | undefined;
        is_average_ir: boolean | undefined;
        is_average_rr: boolean | undefined;
    }

    import type { Region } from "$lib/db/enums";
    import Medal from "$lib/components/user/Medal.svelte";
    import { formatTime, getRoundName } from "$lib/utils";
    import { regionToString } from "$lib/data/regions";
    import puzzles from "$lib/data/puzzles";

    type pk = Promise<{[key: string]: li[]}>
    type listtype = li[] | Promise<li[]> | pk

    export let list: listtype;

    export let k: listtype extends pk ? keyof Awaited<pk> : undefined = undefined

    export let solveCount: number | undefined = undefined;

    export let displayRank: boolean = false;
    export let displayMedals: boolean = false;
    export let proceedNum: number = 0;
    export let showBest: boolean = false;
    export let hasSolves: boolean = true;
    export let hasMeetup: boolean = false;
    export let showUser: boolean = true;
    export let meetupAndRoundLeft: boolean = false;
    export let showDate: boolean = false;
    export let showPlace: boolean = false;
    export let ismbld: boolean = false;

    export let mixDisplayMethod: MixDisplayMethod =
        MixDisplayMethod.FormatColumn;

    export let displayType: DisplayType;

    export let width: string | undefined = undefined;
    export let widths: string[] | undefined = undefined;
</script>

<div class="table-scroller" style:width>
    <table class="table-has-scroller">
        {#if widths}
            <colgroup>
                {#each widths as width}
                    <col span="1" style:width />
                {/each}
            </colgroup>
        {/if}
        <tr>
            {#if meetupAndRoundLeft}
                <th class="tc-meetup-primary">Meetup</th>
                <th class="tc-round">Round</th>
            {/if}
            {#if displayType == DisplayType.MIX && mixDisplayMethod == MixDisplayMethod.FormatColumn}
                <th class="tc-type">Format</th>
            {/if}
            {#if showPlace}
                <th class="tc-place">Place</th>
            {/if}
            {#if showDate}
                <th class="tc-date">Date</th>
            {/if}
            {#if displayRank}
                <th class="tc-ranking" />
            {/if}
            {#if showUser}
                <th class="tc-name">Name</th>
            {/if}
            {#if displayType != DisplayType.MIX || mixDisplayMethod == MixDisplayMethod.FormatColumn}
                <th class="tc-result"
                    >{(() => {
                        switch (displayType) {
                            case DisplayType.AVERAGE:
                                return "Average";
                            case DisplayType.SINGLE:
                                return ismbld ? "Score" : "Time";
                            case DisplayType.MIX:
                                return "Result";
                        }
                    })()}</th
                >
            {:else}
                <th class="tc-mix-single">Single</th>
                <th class="tc-mix-average">Average</th>
            {/if}
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

        {#await list}
            {#each Array(50).fill(0) as _}
                <tr class="loading"><td colspan="999">&nbsp;</td></tr>
            {/each}
        {:then ll}
            {@const l = typeof k === "undefined" ? ll : ll[k]}
            {#if typeof l === "undefined" || l.length == 0}
                <tr>
                <td
                    class="tc-placeholder"
                    align="center"
                    colspan={mixDisplayMethod ==
                    MixDisplayMethod.SeparateAverageAndSingle
                        ? 7
                        : 6}>no results yet</td
                >
                </tr>
            {:else}
                {#each l as list_item, rank}
                    <tr>
                        {#if typeof list_item === "undefined"}
                            <td
                                class="tc-placeholder"
                                align="center"
                                colspan={mixDisplayMethod ==
                                MixDisplayMethod.SeparateAverageAndSingle
                                    ? 7
                                    : 6}>no results yet</td
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
                                cum_min,
                                date,
                                mbld_score,
                                mbld_total,

                                puzzle,
                                round_number,
                                round_maximum,
                                round_id,
                            } = list_item}
                            {#if meetupAndRoundLeft}
                                {@const showMeetup =
                                    meetup_id != l[rank - 1]?.meetup_id}
                                <td class="tc-meetup-primary"
                                    ><a
                                        class="regular-link"
                                        href={`/meetups/${meetup_id}/info`}
                                        >{showMeetup ? meetup_name : ""}</a
                                    ></td
                                >
                                <td class="tc-round"
                                    ><a
                                        class="regular-link"
                                        href={`/meetups/${meetup_id}/results/${round_id}`}
                                        >{getRoundName(
                                            undefined,
                                            round_number + 1,
                                            round_maximum
                                        )}</a
                                    ></td
                                >
                            {/if}
                            {#if displayType == DisplayType.MIX && mixDisplayMethod == MixDisplayMethod.FormatColumn}
                                <td class="tc-type"
                                    >{solves ? "Average" : "Single"}</td
                                >
                            {/if}
                            {#if showPlace}
                                <td class="tc-place">{list_item.rank + 1}</td>
                            {/if}
                            {#if showDate}
                                <td class="tc-date"
                                    >{new Date(date).toLocaleDateString(
                                        "en-nz",
                                        {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        }
                                    )}</td
                                >
                            {/if}

                            {#if displayRank}
                                {@const t = value ?? time}
                                {@const prevT =
                                    l[rank - 1]?.value ?? l[rank - 1]?.time}
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
                                    ><a
                                        class="regular-link"
                                        href={`/user/${user_id}`}>{user_name}</a
                                    ></td
                                >
                            {/if}
                            {#if displayType != DisplayType.MIX || mixDisplayMethod == MixDisplayMethod.FormatColumn}
                                {@const {
                                    is_average_pr,
                                    is_average_icr,
                                    is_average_rr,
                                    is_average_ir,
                                } = list_item}
                                <td
                                    class="tc-result"
                                    data-pr={is_average_pr}
                                    data-icr={is_average_icr}
                                    data-ir={is_average_ir}
                                    data-rr={is_average_rr}
                                    >{formatTime(
                                        value ? value : time,
                                        mbld_score,
                                        mbld_total
                                    )}</td
                                >
                            {:else}
                                <td class="tc-mix-single"
                                    >{!solves ? formatTime(cum_min) : ""}</td
                                >
                                <td
                                    class="tc-mix-average"
                                    data-pr={list_item.is_average_pr}
                                    >{solves ? formatTime(cum_min) : ""}</td
                                >
                            {/if}
                            {#if showBest}
                                {@const {
                                    is_single_pr,
                                    is_single_icr,
                                    is_single_rr,
                                    is_single_ir,
                                } = list_item}
                                <td
                                    class="tc-best"
                                    data-pr={is_single_pr}
                                    data-icr={is_single_icr}
                                    data-ir={is_single_ir}
                                    data-rr={is_single_rr}
                                    >{formatTime(Math.min(...solves))}</td
                                >
                            {/if}
                            {#if showUser}
                                <td class="tc-region"
                                    >{regionToString(user_region)}</td
                                >
                            {/if}

                            {#if hasMeetup}
                                <td class="tc-meetup"
                                    ><a
                                        class="regular-link"
                                        href={`/meetups/${meetup_id}`}
                                        >{meetup_name}</a
                                    ></td
                                >
                            {/if}

                            {#if hasSolves}
                                {#if solves}
                                    {#if solveCount}
                                        {#each solves as time}
                                            <td class="tc-solves"
                                                >{formatTime(time)}</td
                                            >
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
            {/if}
        {/await}
    </table>
</div>

<style>
    .table-scroller {
        overflow-x: scroll;
        min-width: 100%;
        width: 0;
    }

    table {
        width: 100%;
    }

    .tc-name,
    .tc-region,
    .tc-solves,
    .tc-meetup,
    .tc-meetup-primary,
    .tc-round,
    .tc-type {
        text-align: left;
    }

    .tc-name {
        min-width: 200px;
    }

    .tc-result,
    .tc-mix-single,
    .tc-mix-average,
    .tc-meetup-primary,
    .tc-best,
    .tc-name {
        font-weight: 500;
    }

    tr:not(:first-of-type) .tc-name {
        color: var(--c-a);
    }

    .tc-result,
    .tc-mix-single,
    .tc-mix-average,
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

    :is(
            [data-pr="true"],
            [data-icr="true"],
            [data-ir="true"],
            [data-rr="true"]
        ):is(.tc-mix-average, .tc-result, .tc-best) {
        color: var(--c-rec);
    }

    :is([data-pr="true"]):is(.tc-mix-average, .tc-result, .tc-best) {
        --c-rec: var(--c-a);
    }

    :is([data-icr="true"], [data-ir="true"], [data-rr="true"]):is(
            .tc-mix-average,
            .tc-result,
            .tc-best
        )::before {
        font-size: 10px;
        font-weight: 600;
        height: 16px;
        padding-left: 6px;
        padding-right: 6px;
        border-radius: 4px;
        margin-right: 8px;

        color: var(--c-rec);
        background-color: var(--c-rec-bg);
    }

    /* do not change this order */
    :is(.tc-mix-average, .tc-result, .tc-best)[data-rr="true"]::before {
        content: "RR";
    }

    :is(.tc-mix-average, .tc-result, .tc-best)[data-rr="true"] {
        --c-rec: var(--c-green);
        --c-rec-bg: var(--c-lgreen);
    }

    :is(.tc-mix-average, .tc-result, .tc-best)[data-ir="true"]::before {
        content: "IR";
    }

    :is(.tc-mix-average, .tc-result, .tc-best)[data-ir="true"] {
        --c-rec: var(--c-red);
        --c-rec-bg: var(--c-lred);
    }

    :is(.tc-mix-average, .tc-result, .tc-best)[data-icr="true"]::before {
        content: "IcR";
    }

    :is(.tc-mix-average, .tc-result, .tc-best)[data-icr="true"] {
        --c-rec: var(--c-purple);
        --c-rec-bg: var(--c-lpurple);
    }
</style>
