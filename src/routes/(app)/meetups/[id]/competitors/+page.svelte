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
    <colgroup>
        <col span=1 style:width=8px>

        <col span=1 style:width=175px>
        <col span=1 style:width=160px>

        {#each Array(data.puzzles.length) as _}
            <col span=1 style:width=36px>
        {/each}

        <col span=1 style:width=auto>

        <col span=1 style:width=8px>
    </colgroup>


    <tbody>
        <tr>
            <th class="tc-dummy" />

            <th class="tc-name">Name</th>
            <th class="tc-region">Region</th>

            {#each data.puzzles as puzzle}
                <th class="tc-puzzle">
                    <img src={puzzles[puzzle].icon} alt={puzzles[puzzle].name} style:height=24px>
                </th>
            {/each}

            <th class="tc-empty" />

            <th class="tc-dummy" />
        </tr>

        <tr class="td-dummy">
            <td />
            <td />
            <td />

            {#each data.puzzles as puzzle}
                <td />
            {/each}

            <td />
            <td />
        </tr>


        {#each data.meetup.users as { user, registeredEvents } }
            <tr>
                <td class="tc-dummy" />
                <td class="tc-name">
                    <a class="regular-link" style:font-weight=500 href="/user/{user.id}"> {user.name} </a>
                </td>
                <td class="tc-region">{regionToString(user.region)}</td>


                <!-- WARN: this is actually working, but it seems data is not perfect, and those with no results in an event is registered? -->
                {#each data.puzzles as puzzle}
                    <td class="tc-puzzle">
                        {#if registeredEvents.includes(puzzle)}
                            <span class="material-symbols-outlined">check</span>
                        {/if}
                    </td>
                {/each}

                <td class="tc-empty" />

                <td class="tc-dummy" />
            </tr>
        {/each}

        <tr class="td-dummy">
            <td />
            <td />
            <td />

            {#each data.puzzles as puzzle}
                <td />
            {/each}

            <td />
            <td />
        </tr>
    </tbody>
</table>


<style>
    /* INFO: competitors tab */
    .tc-name,
    .tc-region,
    .tc-puzzle {
        text-align: left;
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
