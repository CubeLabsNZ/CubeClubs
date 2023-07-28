<script lang="ts">
    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";
    import Form from "$lib/components/global/Form.svelte";
    import Select from "$lib/components/global/Select.svelte";

    import puzzles from "$lib/data/puzzles"

    import type { PageData } from "./$types";

    export let data: PageData
</script>

<Breadcrumb paths={[
    {name: "Meetups", href: "/dashboard/meetups"},
    {name: data.meetup.name, href: `/dashboard/meetups/${data.meetup.id}`},
    {name: "Data Entry", href: `/dashboard/meetups/${data.meetup.id}/edit/results`}
]} />

<div class="parent-container">
    <div class="entry-container">
        <!-- TODO: fix the form button  -->
        <Form name="Add Solve">
            <label class="form-label">
                Event

                <Select name="event">
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
                    <input required name={`solve-${i}`} />
                </label>
            {/each}
        </Form>
    </div>

    <div class="live-results">
        <p class="label">
            Live Results
        </p>

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


            <tr>
                <td class="tc-dummy"></td>

                <td class="tc-ranking"></td>
                <td class="tc-name">Name</td>
                <td class="tc-result">Average</td>
                <!-- TODO: as many solves as the round has -->
                <td class="tc-solves">S1</td>
                <td class="tc-solves">S2</td>
                <td class="tc-solves">S3</td>
                <td class="tc-solves">S4</td>
                <td class="tc-solves">S5</td>

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
                <td></td>
                <td></td>
            </tr>
        </table>
    </div>
</div>


<style>
    .parent-container {
        display: flex;
        column-gap: 96px;

        margin-top: 48px;
    }

    .entry-container {
        display: flex;
        flex-direction: column;
        row-gap: 16px;
        width: 300px;
    }

    .live-results {
        width: 100%;
    }
</style>
