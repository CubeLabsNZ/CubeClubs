<script lang="ts"> 
    import { goto } from "$app/navigation";

    import { fade } from "svelte/transition";

    import { clickOutside } from "$lib/utils";

    import "$styles/fonts.css";
    import "$styles/globals.css";
    import "$styles/components.css";

    import logo from "$lib/assets/logo-transparent.svg";

    let loggedIn = true, showDropdown = false;

    import Button, { ButtonType, ButtonSize } from "$lib/components/Button.svelte";
</script>

<div id="navbar">
    <div id="navbar-left"> 
        <a class="image-link" href="/">
            <img src={logo} alt="" height=30>
        </a>

        <a class="regular-link" href="/meetups">Meetups</a>
        <a class="regular-link" href="/records">Records</a>
        <a class="regular-link" href="/rankings">Rankings</a>
    </div>

    <div id="navbar-right" use:clickOutside on:click_outside={() => { showDropdown = false }}> 
        {#if !loggedIn}
            <a class="regular-link" href="/login"> Login </a>
            
            <Button type={ButtonType.Regular} size={ButtonSize.Small} perform={() => { goto("/signup") }}>
                <div style:font-weight=500>Sign Up</div>
            </Button>
        {:else}
            <Button type={ButtonType.Regular} size={ButtonSize.Small} padding=3 perform={() => { showDropdown = !showDropdown }}>
                <span class="material-symbols-outlined">account_circle</span>
            </Button>
        {/if}
    </div>

    {#if showDropdown}
        <div id="navbar-dropdown" transition:fade={{ duration: 150 }}>
            <div class="dropdown-inner">
                <a class="dropdown-link" href="/user/0">My Profile</a>
                <a class="dropdown-link" href="/user/edit">Edit Account</a>
            </div>

            <hr>

            <div class="dropdown-inner">
                <a class="dropdown-link" href="/dashboard">
                    <div class="dashboard-link">
                        <p> Admin Dashboard </p>

                        <span class="material-symbols-outlined arrow" style:transform=translateY(1px)>arrow_right_alt</span>
                    </div>
                </a>
            </div>

            <hr>

            <div class="dropdown-inner">
                <a class="dropdown-link" href="/">Log out</a>
            </div>
        </div>
    {/if}
</div>

<div id="main-content"> 
    <slot/>
</div>


<style> 
    .image-link {
        transition: filter 150ms ease-in-out;

        height: 30px;
    }

    .image-link:hover {
        filter: brightness(80%);
    }

    #navbar {
        height: 46px;
        background-color: var(--cdg2);
        border-radius: 12px;
        /* use color-mix when supported/ */
        box-shadow: 0px 4px 16px 0px #292E333D;
        width: fit-content;

        display: flex;
        flex-direction: row;
        align-items: center;
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
        color: var(--clg0);
        text-decoration: none;
        font-size: 14px;
        
        transition: color 100ms ease-in-out;
    }

    #navbar .regular-link:hover {
        color: var(--clg1);
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

        border: 1px var(--clg1) solid;

        width: fit-content;

        display: flex;
        flex-direction: column;

        padding-top: 10px;
        padding-bottom: 10px;

    }

    .dropdown-inner {
        display: flex;
        flex-direction: column;
        row-gap: 16px;

        padding-left: 12px;
        padding-right: 12px;
    }


    .dropdown-link {
        color: var(--cdg2);
        text-decoration: none;
        font-size: 14px;
        font-weight: 400;

        transition: color 150ms ease-in-out;
    }

    .dropdown-link:hover {
        color: black;
    }

    .dashboard-link {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    hr {
        width: 100%;
        padding-left: 0;
        padding-right: 0;

        border: none;
        border-top: 1px solid var(--clg1);

        height: 1px;
    }

    .arrow {
        scale: 0.8;

        font-variation-settings: 
            'wght' 300;
    }
</style>
