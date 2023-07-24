<script lang="ts">
    import { goto } from "$app/navigation";
    import Bar from "$lib/components/Bar.svelte";
    import type { Competition } from "@prisma/client";

    export let href: string;

    export let meetup: Competition
    export let current: boolean | undefined = undefined;
</script>

<a {href}>
    <Bar height={60}>
        <div class="meetup-detail">
            <div class="date" data-current="{current}">
                <p class="fsize-footnote" style:margin-bottom="-1px">
                    {meetup.date.toLocaleString('en-us',{month:'short'}).toUpperCase()}
                </p>
                <p class="fsize-title2" style:margin-top="-2px">
                    {meetup.date.getDate()}
                </p>
            </div>

            <hr class="line" />

            <div class="title">
                <p class="fsize-body">{meetup.name}</p>
                <!-- TODO: fix ts -->
                <p class="fsize-subhead">{meetup.club.name}</p>
            </div>

            <div class="events">
                {#each meetup.puzzles as [_, { icon }]}
                    <img src={icon} alt="" />
                {/each}
            </div>

            <div class="arrow">
                <span class="material-symbols-outlined">chevron_right</span>
            </div>
        </div>
    </Bar>
</a>

<style>
    a {
        text-decoration: none;
    }

    .meetup-detail {
        display: grid;
        width: 100%;

        align-items: center;

        grid-template-columns: [date] 56px [line] 1px [title] 2fr [events] 1fr [arrow] 56px [end];
        }

        .date[data-current=true] {
            color: var(--c-a)
        }

        .date {
            grid-area: date;
            color: var(--c-dg2);

            display: flex;
            flex-direction: column;

            align-items: center;
        }

        .date * {
            font-weight: 500;
        }


        .line {
            grid-area: line;

            border: none;
            border-right: 1.5px solid var(--c-lg1);
            width: 1.5px;

            height: 100%;
        }

        .title {
            padding-left: 16px;

            grid-area: title;

            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        .title p:first-child {
            font-weight: 600;
            color: var(--c-dg2);
        }

        .title p:last-child {
            font-weight: 500;
            color: var(--c-dg1);
        }



        .events {
            grid-area: events;

            display: flex;
            flex-direction: row;
            align-items: center;

            justify-content: flex-end;
            column-gap: 4px;
        }

        .events img {
            height: 28px;
            filter: invert(48%) sepia(8%) saturate(177%) hue-rotate(169deg) brightness(95%) contrast(84%);  /* g */
        }

        .arrow {
            grid-area: arrow;

            display: grid;
            justify-self: end;
            padding-right: 8px;

            color: var(--c-dg2);
        }
</style>
