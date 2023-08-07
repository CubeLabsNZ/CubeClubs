<script lang="ts">
    import puzzles from "$lib/data/puzzles";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";

    import TabBar from "$lib/components/global/TabBar.svelte";
    import {regionToString} from "$lib/data/regions";

    import type { PageData } from "./$types";
    export let data: PageData;

    let locations = ["info", "competitors", "schedule"]
    let tabIndex = 1;

    $: {
        if (browser) {
            goto(`/meetups/${data.slug}/` + locations[tabIndex], { replaceState: true })
        }
    }
</script>


<TabBar
    labels={["Info", "Competitors", "Schedule & Results"]}
    bind:selectedIndex={tabIndex}>
</TabBar>


<table style:margin-top=32px>
    <!-- TODO: for each event in the meetup, show new column AND show ticks for registered */
<!-- NOTE: tc-dummy is entirely invisible to provide padding to either side of the table -->
    <tr>
        <th class="tc-dummy" />

        <th class="tc-name">Name</th>
        <th class="tc-region">Region</th>

        {#each data.puzzles as puzzle}
            <th class="tc-puzzle">
                <img src={puzzles[puzzle].icon} alt={puzzles[puzzle].name} style:height=24px>
            </th>
        {/each}

        <th class="tc-dummy" />
    </tr>

    <!-- NOTE: td-dummy is entirely invisible to provide padding to the top and bottom of the table -->
    <tr class="td-dummy">
        <td />
        <td />
        <td />

        {#each data.puzzles as puzzle}
            <td />
        {/each}

        <td />
    </tr>


    {#each data.meetup.users as { user }}
        <tr>
            <td class="tc-dummy" />
            <td class="tc-name">
                <a href="/user/{user.id}"> {user.name} </a>
            </td>
            <td class="tc-region">{regionToString(user.region)}</td>


            <!-- TODO: only show checkmark if user has registeed  -->
            {#each data.puzzles as puzzle}
                <td class="tc-puzzle">
                    <span class="material-symbols-outlined">check</span>
                </td>
            {/each}

            <td class="tc-dummy" />
        </tr>
    {/each}

    <tr class="td-dummy">
        <td />
        <td />
        <td />
        <td />
    </tr>
</table>


<style>
    /* INFO: competitors tab */
    .tc-name,
    .tc-region,
    .tc-puzzle {
        text-align: left;
    }

    .tc-name {
        min-width: 200px;
        font-weight: 500;
    }

    tr:not(:first-child) .tc-name,
    tr:not(:first-child) .tc-name a {
        color: var(--c-a);
    }


    tr:first-child .tc-puzzle {
        vertical-align: top;
    }


    .tc-puzzle {
        width: 24px;
    }

    tr:first-child .tc-puzzle img {
        filter: invert(30%) sepia(7%) saturate(500%) hue-rotate(164deg) brightness(94%) contrast(89%);
        transform: translateY(2px);
    }

    .tc-puzzle img {
        height: 24px;
    }
</style>
