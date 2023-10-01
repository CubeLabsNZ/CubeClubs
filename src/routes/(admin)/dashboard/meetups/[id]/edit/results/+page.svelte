<script lang="ts">
    import { browser } from "$app/environment";
    import { goto, invalidate, invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";

    import { formatTime, getRoundName } from "$lib/utils";

    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";
    import Form from "$lib/components/global/Form.svelte";
    import Select from "$lib/components/global/Select.svelte";

    import puzzles from "$lib/data/puzzles"
    import formats from "$lib/data/formats"

    import type { PageData, ActionData } from "./$types";
    import { puzzle } from "@prisma/client";

    export let data: PageData
    export let form: ActionData

    let roundId: number | undefined = form?.event ?? $page.url.searchParams.get("roundId") ?? data.meetup.rounds[0]?.id;

    let selectedRound;
    let selectedRoundPuzzleFormatCount;

    $: {
        if (roundId) {
            updateQuery(roundId);

            selectedRound = data.meetup.rounds.find(r => r.id === roundId);
            selectedRoundPuzzleFormatCount = formats[selectedRound.format].count;
        }
    }

    async function updateQuery(roundId: number) {
        if (!browser) { return }

        let query = new URLSearchParams($page.url.searchParams.toString());

        query.set("roundId", roundId);

        goto(`?${query.toString()}`);
    }

    let inputError = -1;
</script>

<Breadcrumb paths={[
    {name: "Meetups", href: "/dashboard/meetups"},
    {name: data.meetup.name, href: `/dashboard/meetups/${data.meetup.id}`},
    {name: "Data Entry", href: `/dashboard/meetups/${data.meetup.id}/edit/results`}
]} />

{#if roundId}
<div class="parent-container">
    <div class="entry-container">
        <!-- TODO: fix the form button  -->
        <Form name="Add Solve" run={({ formData, cancel }) => {
            let i = -2;

            for (const value of formData.values()) {
                if (i < 0) { i++; continue; }

                if (value.toLowerCase() === "dnf") {
                    formData.set(`solve-${i}`, Infinity);
                    i++;
                    continue;
                }

                if (isNaN(value)) {
                    cancel();
                    inputError = i;
                }

                i++
            }

            formData.set("roundFormat", selectedRound.format);

            return async ({ result, update }) => {
                update();
                inputError = -1;
            }
        }}>
            <label class="form-label">
                Event
                <div style:display=grid>
                    <!-- FIXME: this is this the Select component inlined! Select component for some reason doesnt bind correctly -->
                    <select required name="event" bind:value={roundId}>
                        <option disabled selected value>Select an event</option>
                        {#each data.meetup.rounds as round}
                            {@const puzzle = puzzles[round.puzzle]}
                            <option value={round.id}>{getRoundName(puzzle.name, round.number, round.maxRounds)}</option>
                        {/each}
                    </select>

                    <span class="material-symbols-outlined select-icon">expand_more</span>
                </div>
            </label>

            <label class="form-label">
                Competitor Name
                <Select name="competitor">
                    <option disabled selected value>Select a competitor</option>
                    {#each selectedRound.users as {user_id, user_name}}
                        <option value={user_id}>{user_name}</option>
                    {/each}
                </Select>
            </label>


            {#each Array(selectedRoundPuzzleFormatCount) as _, i}
                <label class="form-label">
                    Solve {i+1}
                    <input required name={`solve-${i}`} autocomplete=off data-error={inputError} />
                    {#if selectedRound.puzzle == puzzle.MULTIBLD}
                        Successes {i+1}
                        <input required name={`successes-${i}`} autocomplete=off data-error={inputError} />
                        Attempts {i+1}
                        <input required name={`attempts-${i}`} autocomplete=off data-error={inputError} />
                    {/if}

                    {#if inputError === i}
                        <p class="fsize-subhead" style:color=var(--c-red)>please enter a valid value</p>
                    {/if}
                </label>

            {/each}
        </Form>
    </div>

    <div class="live-results">
        <p class="label">
            Live Results
        </p>

        {#if roundId === undefined}
            <p> No events added for this meetup. </p>
        {:else}
            <p> {roundId} </p>


            <!-- TODO: more duplicataion yay -->
            <table style:width=100%>
                <colgroup>
                    <col span=1 style:width=8px>

                    <col span=1 style:width=50px>
                    <col span=1 style:width=auto>
                    <col span=1 style:width=80px>

                    {#each Array(selectedRoundPuzzleFormatCount) as _}
                        <col span=1 style:width=80px>
                    {/each}

                    <col span=1 style:width=8px>
                </colgroup>


                <tbody>
                    <tr>
                        <th class="tc-dummy"></th>

                        <th class="tc-ranking"></th>
                        <th class="tc-name">Name</th>
                        <th class="tc-result">Average</th>

                        {#each Array(selectedRoundPuzzleFormatCount) as _, i}
                            <th class="tc-solves">{i + 1}</th>
                        {/each}

                        <th class="tc-dummy"></th>
                    </tr>

                    <tr class="td-dummy">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>

                        {#each Array(selectedRoundPuzzleFormatCount) as _, i}
                            <td></td>
                        {/each}

                        <td></td>
                    </tr>


                    {#each selectedRound.results as result,idx }
                        {#if result}
                        <tr>
                            <td class="tc-dummy"></td>

                            <td class="tc-ranking">{idx+1}</td>
                            <td class="tc-name">{result.user_name}</td>
                            <td class="tc-result">{formatTime(result.value)}</td>

                            {#each result.solves as solve}
                                <td class="tc-solves">{formatTime(solve.time)}</td>
                            {/each}

                            <td class="tc-dummy"></td>
                        </tr>
                        {/if}
                    {/each}


                    <tr class="td-dummy">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>

                        {#each Array(selectedRoundPuzzleFormatCount) as _, i}
                            <td></td>
                        {/each}

                        <td></td>
                    </tr>
                </tbody>
            </table>
        {/if}
    </div>
</div>
{:else}
    <p>No rounds! Add rounds in <a href="./schedule">the schedule</a> first.</p>
{/if}


<style>
    .parent-container {
        display: flex;
        column-gap: 64px;

        margin-top: 48px;
    }

    .entry-container {
        display: flex;
        flex-direction: column;
        row-gap: 16px;
        width: 400px;
    }

    .live-results {
        width: 100%;
    }


    /* INFO: ranking table */
    .tc-name {
        text-align: left;
    }

    .tc-result, .tc-name {
        font-weight: 500;
    }

    .tc-result, .tc-ranking, .tc-solves {
        text-align: right;
    }

    .tc-ranking {
        color: var(--c-dg1);
    }

    select {
        grid-area: 1/1;

        padding-right: 32px;
    }

    .select-icon {
        font-size: 20px;
        align-self: center;
        justify-self: flex-end;
        padding-right: 4px;
        grid-area: 1/1;
        pointer-events: none;
    }
</style>
