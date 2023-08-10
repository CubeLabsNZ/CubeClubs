<script lang="ts">
    import { browser } from "$app/environment";
    import { goto, invalidate, invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";

    import { DNF } from "$lib/utils";

    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";
    import Form from "$lib/components/global/Form.svelte";
    import Select from "$lib/components/global/Select.svelte";

    import puzzles from "$lib/data/puzzles"

    import type { PageData, ActionData } from "./$types";

    export let data: PageData
    export let form: ActionData

    // BUG: NOTHING FUCKING WORKS
    // TODO: set the fucking event select to what it was previously
    let roundId: number | undefined = form?.event ?? data.roundId;

    $: {
        updateQuery(roundId);
        console.log("ROUND ID PAGE", roundId)
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

<div class="parent-container">
    <div class="entry-container">
        <!-- TODO: fix the form button  -->
        <Form name="Add Solve" run={({ formData, cancel }) => {
            let i = -2;

            for (const value of formData.values()) {
                if (i < 0) { i++; continue; }

                if (value.toLowerCase() === "dnf") {
                    formData.set(`solve-${i}`, "dnf");
                    i++;
                    continue;
                }

                if (isNaN(value) || value >= DNF) {
                    cancel();
                    inputError = i;
                }

                i++
            }

            return async ({ result, update }) => {
                update();
                inputError = -1;
            }
        }}>
            <label class="form-label">
                Event

                <Select name="event" bind:value={roundId}>
                    <option disabled selected value>Select an event</option>
                    {#each data.meetup.rounds as round}
                        {@const puzzle = puzzles[round.puzzle]}
                        <option value={round.id}>{puzzle.name} - Round {round.number}</option>
                    {/each}
                </Select>
            </label>

            <label class="form-label">
                Competitor Name
                <Select name="competitor">
                    <option disabled selected value>Select a competitor</option>
                    {#each data.meetup.users as {user}}
                        <option value={user.id}>{user.name}</option>
                    {/each}
                </Select>
            </label>


            <!-- TODO: as many as the format of the round it (eg ao5 = 5, mo3 = 3, bld = 1?) -->
            {#each Array(5) as _, i}
                <label class="form-label">
                    Solve {i+1}
                    <input required name={`solve-${i}`} autocomplete=off data-error={inputError} />

                    {#if inputError === i}
                        <p class="fsize-subhead" style:color=var(--c-red)>please enter a valid time</p>
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
                <!-- NOTE: tc-dummy is entirely invisible to provide padding to either side of the table -->
                <tr>
                    <th class="tc-dummy"></th>

                    <th class="tc-ranking"></th>
                    <th class="tc-name">Name</th>
                    <th class="tc-result">Average</th>
                    <!-- TODO: as many solves as the round has -->
                    <th class="tc-solves">S1</th>
                    <th class="tc-solves">S2</th>
                    <th class="tc-solves">S3</th>
                    <th class="tc-solves">S4</th>
                    <th class="tc-solves">S5</th>

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
                    <td></td>
                    <td></td>
                </tr>


                {#each data.meetup.rounds as round }
                    {#each round.results as result,idx }
                        <tr>
                            <td class="tc-dummy"></td>

                            <td class="tc-ranking">{idx+1}</td>
                            <td class="tc-name">{result.user.name}</td>
                            <td class="tc-result">{result.value}</td>
                            <!-- TODO: as many solves as the round has -->
                            {#each result.solves as solve}
                                <td class="tc-solves">{solve.time}</td>
                            {/each}

                            <td class="tc-dummy"></td>
                        </tr>
                    {/each}
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
                    <td></td>
                    <td></td>
                </tr>
            </table>
        {/if}
    </div>
</div>


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
</style>
