<script lang="ts">
    import Breadcrumb from '$lib/components/global/Breadcrumb.svelte';
    import Button from '$lib/components/global/Button.svelte';

    import puzzles from "$lib/data/puzzles";
    import { regionToString } from '$lib/data/regions';

    import type { PageData } from './$types';
    export let data: PageData;

    console.log(data.meetup.users)
</script>

<Breadcrumb paths={[
    {name: "Meetups", href: "/dashboard/meetups"},
    {name: data.meetup.name, href: `/dashboard/meetups/${data.meetup.id}/`},
    {name: "Edit Competitors", href: `/dashboard/meetups/${data.meetup.id}/edit/users`}
]} />

<div style:height="16px" />

<a href="/dashboard/meetups/{data.meetup.id}/edit/users/add">
    <Button>
        <div class="button-inner">
            <span class="material-symbols-outlined">add</span>
            <p> Add Competitor </p>
        </div>
    </Button>
</a>


<h3 class="fsize-title2" style:font-weight=500 style:margin-top=32px style:margin-bottom=16px>Registered Competitors</h3>

<table>
    <colgroup>
        <col span=1 style:width=8px>

        <col span=1 style:width=175px>
        <col span=1 style:width=160px>

        {#each Array(data.meetup.puzzles.length) as _}
            <col span=1 style:width=36px>
        {/each}

        <col span=1 style:width=auto>

        <col span=1 style:width=8px>
    </colgroup>


    <tbody>
        <!-- TODO: for each event in the meetup, show new column AND show ticks for registered */
<!-- NOTE: tc-dummy is entirely invisible to provide padding to either side of the table -->
        <tr>
            <th class="tc-dummy" />

            <th class="tc-name">Name</th>
            <th class="tc-region">Region</th>

            {#each data.meetup.puzzles as puzzle}
                <th class="tc-puzzle">
                    <img src={puzzles[puzzle].icon} alt={puzzles[puzzle].name} style:height=24px>
                </th>
            {/each}

            <th class="tc-empty" />

            <th class="tc-dummy" />
        </tr>

        <!-- NOTE: td-dummy is entirely invisible to provide padding to the top and bottom of the table -->
        <tr class="td-dummy">
            <td />
            <td />
            <td />

            {#each data.meetup.puzzles as puzzle}
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
                {#each data.meetup.puzzles as puzzle}
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


    .button-inner {
        display: flex;
        align-items: center;
        column-gap: 8px;
    }

    .button-inner span {
        font-size: 20px;
    }
</style>
