<script lang="ts">
    import Breadcrumb from '$lib/components/global/Breadcrumb.svelte';
    import MultiSelect, { LabelType } from '$lib/components/global/MultiSelect.svelte';
    import Form from '$lib/components/global/Form.svelte';

    import Badge, { BadgeSize } from "$lib/components/global/Badge.svelte";
    import { clickOutside } from "$lib/utils";
    import { fade } from "svelte/transition";

    import puzzles from "$lib/data/puzzles";

    let searchString = "";

    let selectedEvents = new Set();

    import type { PageData } from './$types';
    export let data: PageData;

    let error = "";

    let selectedCompetitor = undefined;

    let inputDisabled: false

    $: inputDisabled = selectedCompetitor != undefined
</script>

<Breadcrumb paths={[
    {name: "Meetups", href: "/dashboard/meetups"},
    {name: data.meetup.name, href: `/dashboard/meetups/${data.meetup.id}/`},
    {name: "Edit Competitors", href: `/dashboard/meetups/${data.meetup.id}/edit/users`},
    {name: "Add Competitor", href: `/dashboard/meetups/${data.meetup.id}/edit/users/add`},
]} />

<div style:height="16px" />


<Form 
    name="Add Competitor" 
    fillWidth={false}
    run={({ formData, cancel }) => {
        const eventsArray = [...selectedEvents];

        error = "";

        if (eventsArray.length === 0) {
            cancel();
            error = "events";
        }

        if (selectedCompetitor === undefined) {
            cancel();
            error = "competitor";
        }

        if (error === "") {
            formData.set("events", eventsArray.map(i => Object.keys(puzzles)[i]).join(":"))
            formData.set("competitor", selectedCompetitor.id)
        }
    }}>

    <div style:position=relative use:clickOutside on:click_outside={() => { searchString = "" }}>
        <label class="form-label">
            Add Competitor
            <input 
                bind:value={searchString} 
                name="competitor"
                data-error={error === "competitor"}
                autocomplete=off
                disabled={inputDisabled}
            />
        </label>

        {#if searchString !== ""}
            {@const filtered = data.users.filter((user) => {
                return user.name.toLowerCase().includes(searchString.toLowerCase()) && !(data.meetup.users.map(u => u.userId).includes(user.id))
            })}
            <div class="search-results" transition:fade={{ duration: 100 }}>
                {#if filtered.length === 0}
                    <p class="search-result" style:display=grid style:align-items=center> oops, no users found </p>
                {:else}
                    {#each filtered as competitor}
                        <button class="search-result interactable" on:click|preventDefault|stopPropagation={() => {
                            selectedCompetitor = competitor
                            searchString = "";
                        }}>
                            {competitor.name}
                        </button>
                    {/each}
                {/if}
            </div>
        {/if}


        {#if selectedCompetitor}
            <button class="organiser-button" on:click|preventDefault={() => {selectedCompetitor = undefined}}>
                <Badge size={BadgeSize.Large} fg=var(--c-a) bg=var(--c-la1) label={ `${selectedCompetitor.name}`}>
                    <span class="material-symbols-outlined" style:color=var(--c-a) style:font-size=16px style:font-weight=600 style:padding-right=8px>close</span>
                </Badge>
            </button>
        {/if}

        {#if error === "competitor"}
            <p class="fsize-subhead" style:color=var(--c-red)> please select a competitor </p>
        {/if}
    </div>



    <label class="form-label">
        Add Events

        {#if data.meetup.puzzles.length > 0}
            <MultiSelect 
                bind:selectedIndices={selectedEvents} 
                padding={4} 
                fixedHeight={false} 
                labels={ Object.entries(puzzles).filter(p => data.meetup.puzzles.includes(p[0])).map(p => ({type: LabelType.Image, data: p[1].icon})) } />

            {#if error === "events"}
                <p class="fsize-subhead" style:color=var(--c-red)> please select atleast one event </p>
            {/if}
        {:else}
            <p style:color={error === "events" ? "var(--c-red)" : "var(--c-g)"}> There are no events added to this meetup. Please add events to the schedule before adding competitors.</p>
        {/if}
    </label>
</Form>


<style>
    .search-results {
        position: absolute;
        margin-top: 8px;

        width: 100%;

        z-index: 10;


        background-color: white;
        border-radius: 6px;
        box-shadow: 0px 1px 6px 0px #10151B29; /* cdg3, 16% */


        height: fit-content;

        display: flex;
        flex-direction: column;
        align-items: flex-begin;

        border: 1px var(--c-lg1) solid;
    }

    .search-result {
        height: 32px;
        width: 100%;
        padding-left: 8px;
        padding-right: 8px;
        color: var(--c-dg2);

        font-size: 16px;

        text-align: left;
    }

    .search-result.interactable {
        cursor: pointer;
    }

    .search-result.interactable:hover {
        color: var(--c-dg3);
    }

    .organiser-button {
        cursor: pointer;

        z-index: 10;
        position: absolute;

        padding-left: 6px;
        width: fit-content;

        height: 28px;
        transform: translateY(-31px);
    }

    .organiser-button:hover {
        filter: brightness(90%);
    }
</style>
