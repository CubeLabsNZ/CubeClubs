<script lang="ts"> 
    import type { LayoutData } from "./$types";

    import "$styles/fonts.css";
    import "$styles/globals.css";
    import "$styles/components.css";

    import { fade } from "svelte/transition";
    import { clickOutside } from "$lib/utils";


    import logo from "$lib/assets/logo-transparent.svg";

    // TODO: bind to actual user values & session
    let showDropdown = false;

    let showMore = false;

    import Button, { ButtonType, ButtonSize } from "$lib/components/global/Button.svelte";
    import { ArrowRight, ArrowRightCircle, Menu, UserCircle, UserCircle2, X, XIcon } from "lucide-svelte";

    export let data: LayoutData;
</script>

<div id="navbar">
    <div id="navbar-left"> 
        <a class="image-link" aria-label="Home Page" href="/" style:user-select=none>
            <img src={logo} alt="" height=30 width=30>
        </a>

        <a class="regular-link navbar-full" href="/meetups">Meetups</a>
        <a class="regular-link navbar-full" href="/records">Records</a>
        <a class="regular-link navbar-full" href="/rankings">Rankings</a>

        <input type="text" style:background-color=yellow style:color=cyan style:width=300px style:font-family="Snell Roundhand">
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
            <button on:click={() => { showDropdown = !showDropdown; showMore = false }} aria-expanded={showDropdown} aria-controls="navbar-dropdown">
                <Button type={ButtonType.Simple} size={ButtonSize.Small} padding={8}>
                    <div style:display=flex style:align-items=center style:column-gap=8px>
                        <UserCircle size="18px" />

                        <p style:font-weight=500 style:padding-right=6px style:height=20px style:transform=translateY(1px)>{data.user.name.split(" ")[0]}</p>
                    </div>
                </Button>
            </button>
        {/if}

        <button on:click={() => { showMore = !showMore; showDropdown = false }} class="navbar-small show-more-button" style:height=20px aria-expanded={showMore} aria-label={`${showMore ? "Hide" : "Show"} navigation menu menu.`} aria-controls="navbar-showmore">
            {#if !showMore}
                <Menu size="18px" />
            {:else}
                <X size="18px" />
            {/if}
        </button>
    </div>

    <div id="navbar-showmore" class="navbar-small dropdown" hidden={!showMore}>
        <a class="regular-link" href="/meetups">Meetups</a>

        <hr class="showmore-hr">

        <a class="regular-link" href="/records">Records</a>

        <hr class="showmore-hr">

        <a class="regular-link" href="/rankings">Rankings</a>
    </div>

    <div id="navbar-dropdown" class="dropdown" hidden={!showDropdown}>
        <div class="dropdown-inner">
            <a class="dropdown-link" href={`/user/${data.user?.id}`}>My Profile</a>
            <a class="dropdown-link" href="/user/edit">Edit Account</a>
        </div>

        {#if data.user?.is_club_organiser}
            <hr class="dropdown-hr">

            <div class="dropdown-inner">
                <a class="dropdown-link" href="/dashboard/meetups">
                    <div class="dashboard-link">
                        <p> Admin Dashboard </p>

                        <ArrowRight size="16px" />
                    </div>
                </a>
            </div>
        {/if}

        <hr class="dropdown-hr">

        <div class="dropdown-inner">
            <a on:mousedown={() => { showDropdown = false }} data-sveltekit-preload-data="tap" class="dropdown-link" href="/logout">Log out</a>
        </div>
    </div>
</div>

<slot/>


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

        flex-direction: column;

        padding-top: 10px;
        padding-bottom: 10px;


        z-index: 30;
    }

    #navbar-showmore {
        box-sizing: border-box;

        background-color: var(--c-dg2);
        border-radius: 12px;

        box-shadow: 0px 4px 16px 0px #292E333D;
        width: calc(100% - 40px);

        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        padding: 12px 16px 12px 16px;

        position: fixed;
        top: 70px;
        left: 20px;

        z-index: 20;

        font-weight: 500;
    }

    .dropdown {
        display: flex;

        visibility: hidden;
        opacity: 0;
        transition: visibility 0s linear 150ms, opacity 150ms linear;
    }

    .dropdown:not([hidden]) {
        visibility: visible;
        opacity: 1;
        transition-delay: 0s;
    }

    @media(max-width: 600px) {
        #navbar {
            width: calc(100% - 40px);
            margin-left: 20px;
            margin-right: 20px;
            gap: 16px;
        }

        .navbar-full {
            display: none;
        }

        #navbar-right {
            gap: 16px;
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

    .show-more-button {
        color: var(--c-lg0);
        font-size: 20px;
        padding-right: 8px;

        cursor: pointer;
    }

    .show-more-button:hover {
        color: var(--c-lg1);
    }

    .show-more-button > :global(svg) {
        margin-bottom: 1px;
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

    @media(min-width: 601px) {
        #navbar-showmore {
            display: none;
        }

        .navbar-small {
            display: none;
        }
    }
</style>

