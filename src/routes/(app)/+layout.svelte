<script lang="ts"> 
    import type { LayoutData } from "./$types";

    import "$styles/fonts.css";
    import "$styles/globals.css";
    import "$styles/components.css";


    import { goto } from "$app/navigation";
    import { fade } from "svelte/transition";
    import { clickOutside } from "$lib/utils";


    import logo from "$lib/assets/logo-transparent.svg";

    // TODO: bind to actual user values & session
    let showDropdown = false;

    let showMore = false;

    import Button, { ButtonType, ButtonSize } from "$lib/components/global/Button.svelte";

    export let data: LayoutData;
</script>

<div id="navbar">
    <div id="navbar-left"> 
        <a class="image-link" href="/">
            <img src={logo} alt="" height=30>
        </a>

        <a class="regular-link navbar-full" href="/meetups">Meetups</a>
        <a class="regular-link navbar-full" href="/records">Records</a>
        <a class="regular-link navbar-full" href="/rankings">Rankings</a>
    </div>

    <div id="navbar-right" class="navbar-full" use:clickOutside on:click_outside={() => { showDropdown = false; showMore = false }}> 
        {#if !data.user}
            <a class="regular-link" href="/login"> Login </a>
            
            <a href="/signup">
                <Button type={ButtonType.Simple} size={ButtonSize.Small}>
                    <div style:font-weight=500>Sign Up</div>
                </Button>
            </a>
        {:else}
            <button on:click={() => { showDropdown = !showDropdown; showMore = false }}>
                <Button type={ButtonType.Simple} size={ButtonSize.Small} padding={8}>
                    <div style:display=flex style:align-items=center style:column-gap=8px>
                        <span class="material-symbols-outlined" style:font-size=20px>account_circle</span>

                        <p style:font-weight=500 style:padding-right=6px style:height=20px>{data.user.name.split(" ")[0]}</p>
                    </div>
                </Button>
            </button>
        {/if}

        <button on:click={() => { showMore = !showMore; showDropdown = false }} class="navbar-small" style:height=20px>
            {#if !showMore}
                <span class="material-symbols-outlined show-more-button" >menu</span>
            {:else}
                <span class="material-symbols-outlined show-more-button" >close</span>
            {/if}
        </button>
    </div>

    {#if showMore}
        <div id="navbar-showmore" class="navbar-small" transition:fade={{ duration: 150 }}>
            <a class="regular-link" href="/meetups">Meetups</a>

            <hr class="showmore-hr">

            <a class="regular-link" href="/records">Records</a>

            <hr class="showmore-hr">

            <a class="regular-link" href="/rankings">Rankings</a>
        </div>
    {/if}

    {#if showDropdown}
        <div id="navbar-dropdown" transition:fade={{ duration: 150 }}>
            <div class="dropdown-inner">
                <a class="dropdown-link" href={`/user/${data.user.id}`}>My Profile</a>
                <a class="dropdown-link" href="/user/edit">Edit Account</a>
            </div>

            {#if data.user?.isClubOrganiser}
                <hr class="dropdown-hr">

                <div class="dropdown-inner">
                    <a class="dropdown-link" href="/dashboard/meetups">
                        <div class="dashboard-link">
                            <p> Admin Dashboard </p>

                            <span class="material-symbols-outlined arrow">arrow_right_alt</span>
                        </div>
                    </a>
                </div>
            {/if}

            <hr class="dropdown-hr">

            <div class="dropdown-inner">
                <a on:mousedown={() => { showDropdown = false }} data-sveltekit-preload-data="tap" class="dropdown-link" href="/logout">Log out</a>
            </div>
        </div>
    {/if}
</div>

<div id="main-content"> 
    <slot/>
</div>


<style> 
    /* TODO: organise these styles */

    .image-link {
        transition: filter var(--v-animation-delay) ease-in-out;

        height: 30px;
    }


    .image-link:hover {
        filter: brightness(80%);
    }

    #navbar {
        height: 46px;
        background-color: var(--c-dg2);
        border-radius: 12px;
        /* use color-mix when supported/ */
        box-shadow: 0px 4px 16px 0px #292E333D;
        width: fit-content;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 96px;

        font-family: "IBMPlexSans";

        padding: 8px;
        box-sizing: border-box;

        position: fixed;
        top: 16px;
        margin: 0 auto;
        left: 0; right: 0;

        z-index: 10;

        font-weight: 500;

    }

    #navbar .regular-link {
        color: var(--c-lg0);
        text-decoration: none;
        font-size: 14px;
        
        transition: color 100ms ease-in-out;
    }

    #navbar .regular-link:hover {
        color: var(--c-lg1);
    }


    #navbar-left, #navbar-right {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 24px;
    }

    #navbar-dropdown {
        position: absolute;
        right: 0;
        top: 54px; /* h=46 + p=8 */

        background-color: white;
        border-radius: 6px;
        box-shadow: 0px 1px 6px 0px #10151B29; /* cdg3, 16% */

        border: 1px var(--c-lg1) solid;

        height: fit-content;

        display: flex;
        flex-direction: column;

        padding-top: 10px;
        padding-bottom: 10px;


        z-index: 30;
    }

    @media(max-width: 550px) {
        #navbar {
            width: calc(100% - 40px);
            margin-left: 20px;
            margin-right: 20px;
            gap: 64px;
        }

        .navbar-full {
            display: none;
        }
    }


    .dropdown-inner {
        display: flex;
        flex-direction: column;
        row-gap: 16px;

        padding-left: 12px;
        padding-right: 12px;
    }


    .dropdown-link {
        color: var(--c-dg2);
        text-decoration: none;
        font-size: 14px;
        font-weight: 400;

        transition: color var(--v-animation-delay) ease-in-out;
    }

    .dropdown-link:hover {
        color: black;
    }

    .dashboard-link {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .dropdown-hr {
        width: 100%;
        padding-left: 0;
        padding-right: 0;

        border: none;
        border-top: 1px solid var(--c-lg1);

        height: 1px;
    }

    .arrow {
        font-size: 20px;

        font-variation-settings: 
            'wght' 300;
    }


    .show-more-button {
        color: var(--c-lg0);
        font-size: 20px;
        padding-right: 8px;

        cursor: pointer;
    }

    .show-more-button:hover {
        color: var(--c-lg1);
    }

    #navbar-showmore {
        box-sizing: border-box;

        background-color: var(--c-dg2);
        border-radius: 12px;

        box-shadow: 0px 4px 16px 0px #292E333D;
        width: calc(100% - 40px);

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        font-family: "IBMPlexSans";

        padding: 12px 16px 12px 16px;

        position: fixed;
        top: 70px;
        left: 20px;

        z-index: 20;

        font-weight: 500;
    }

    #navbar-showmore > a {
        width: 100%;
    }

    .showmore-hr {
        width: calc(100% + 32px);

        margin-left: -16px;

        margin-top: 12px;
        margin-bottom: 12px;

        border: none;
        border-top: 1px solid var(--c-dg1);

        height: 1px;
    }

    @media(min-width: 550px) {
        #navbar-showmore {
            display: none;
        }

        .navbar-small {
            display: none;
        }
    }
</style>

