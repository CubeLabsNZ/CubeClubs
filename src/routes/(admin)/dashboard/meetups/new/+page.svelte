<script lang="ts">
    import { clickOutside } from "$lib/utils";

    import Badge, { BadgeSize } from "$lib/components/global/Badge.svelte";

    import { fade } from "svelte/transition";

    import Form from "$lib/components/global/Form.svelte";

    import Select from "$lib/components/global/Select.svelte";
    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";
    import Snackbar from "$lib/components/global/Snackbar.svelte";

    import type { PageData } from './$types';

    export let data: PageData;

    let searchString = "";
    let addedOrganisers = [];


    let sizes = [];

    let externalRegistration = false;


    function handleForm({ formData, cancel }) {
        if (addedOrganisers.length < 1) { cancel(); showError() }
        formData.set("organisers", addedOrganisers.reduce((acc, cur) => `${acc} ${cur.id}`, ""));
    }

    let organisersError = false;
    function showError() {
        organisersError = true;

        setTimeout(() => { organisersError = false }, 3000)
    }

</script>

<Breadcrumb paths={[
    {name: "Meetups", href: "/dashboard/meetups"},
    {name: "New Meetup", href: "/dashboard/meetups/new"}
]} />

<div style:height="16px" />

<Form name="Create meetup" run={handleForm}>
    <div class="form-inner">
        <label class="form-label regular">
            Meetup Name
            <input required name="name" />
        </label>

        <label class="form-label regular">
            Host Club

            <Select name="clubId">
                <option disabled selected value>Select a Club</option>
                <!-- TODO: figure out ts complaining? -->
                {#each data.clubs as {id, name} }
                    <option value={id}>{name}</option>
                {/each}
            </Select>
        </label>

        <label class="form-label">
            Date
            <input required name="date" type="date" />
        </label>

        <label class="form-label">
            Venue Name
            <input required name="venue" />
        </label>

        <!-- TODO: autocomplete here would be cool -->
        <label class="form-label regular">
            Location
            <input required name="location" />
        </label>

        <div style:position=relative class="wide" use:clickOutside on:click_outside={() => { searchString = "" }}>
            <label class="form-label">
                Organisers
                <input 
                    bind:value={searchString} 
                    name="organisers"
                    style:padding-left={[...addedOrganisers].reduce((total, cur) => total + sizes[cur.id], 0) + (addedOrganisers.length + 1) * 6}px
                />
            </label>

            {#if searchString !== ""}
                {@const filtered = data.organisers.filter((org) => {return org.name.toLowerCase().includes(searchString.toLowerCase())})}
                <div class="search-results" transition:fade={{ duration: 100 }}>
                    {#if filtered.length === 0}
                        <p class="search-result" style:display=grid style:align-items=center> oops, no organisers found </p>
                    {:else}
                        {#each filtered as organiser}
                            <button class="search-result interactable" on:click|preventDefault|stopPropagation={() => {
                                if (!addedOrganisers.includes(organiser)) { addedOrganisers.push(organiser); addedOrganisers = addedOrganisers }
                                searchString = "";
                            }}>
                                {organiser.name}
                            </button>
                        {/each}
                    {/if}
                </div>
            {/if}


            <div class="added-organisers">
                {#each addedOrganisers as { name, id }}
                    <button class="organiser-button" bind:clientWidth={sizes[id]} on:click|preventDefault={() => {addedOrganisers = addedOrganisers.filter(org => org.id != id)}}>
                        <Badge size={BadgeSize.Large} fg=var(--c-a) bg=var(--c-la1) label={` ${name}`}>
                            <span class="material-symbols-outlined" style:color=var(--c-a) style:font-size=16px style:font-weight=600 style:padding-right=8px>close</span>
                        </Badge>
                    </button>
                {/each}
            </div>
        </div>

        <label class="form-label regular">
            Contact Details
            <input required name="contact" />
        </label>

        <label class="form-label regular">
            Competitor Limit
            <input required name="competitorLimit" type="number"/>
        </label>


        <label class="form-label">
            Registration Handling

            <Select name="usingExternalRegistration" bind:value={externalRegistration}>
                <option selected value={false}>Internal Registration</option>
                <option value={true}>External Registration</option>
            </Select>
        </label>

        {#if externalRegistration}
            <label class="form-label semiwide">
                External Registration Link

                <input required name="externalRegistrationLink" />
            </label>


            <p class="wide" style:color=var(--c-red)> Warning: you must provide your own registration link AND you are responsible for manually entering all competitors into a meetup including the events they are registered for. You should also provide registration information, and additional details such as the price and payment options accepted. </p>

        {/if}

        <label class="form-label wide">
            Registration Information
            <textarea
                required
                name=registrationInformation
                rows=8
                style:min-height=50px
                style:max-height=500px
                style:resize=vertical
            />
        </label>

        <label class="form-label wide">
            Meetup Description
            <textarea
                required
                name=description
                rows=8
                style:min-height=50px
                style:max-height=500px
                style:resize=vertical
            />
        </label>
    </div>
</Form>

{#if organisersError}
    <Snackbar> 
        <span class="material-symbols-outlined" style:color=var(--c-red) style:font-size=20px> error </span>
        <p style:color=var(--c-red)> no organisers added </p>
    </Snackbar>
{/if}


<style>
    textarea {
        font-family: "IBMPlexSans"
    }

    .form-inner {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 16px 32px;
    }

    .regular {
        grid-column: span 2;
    }

    .wide {
        grid-column: 1 / span 4;
    }

    .semiwide {
        grid-column: span 3;
    }


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

    .added-organisers {
        display: flex;
        z-index: 10;
        position: absolute;

        padding-left: 6px;
        width: fit-content;

        align-items: center;

        height: 28px;
        transform: translateY(-31px);

        column-gap: 6px;
    }

    .organiser-button {
        cursor: pointer;
    }

    .organiser-button:hover {
        filter: brightness(90%);
    }

    .resizable-textarea {
        resize: vertical;
    }
</style>
