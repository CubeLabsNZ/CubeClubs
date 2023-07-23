<script lang="ts">
    import { goto } from "$app/navigation";

    import "$styles/fonts.css";
    import "$styles/globals.css";
    import "$styles/components.css";


    import logo from "$lib/assets/logo-text-dark.svg";

    import SidebarTab from "$lib/components/SidebarTab.svelte";
    import { page } from "$app/stores";


    let currentPage: string;

    /* NOTE: IMPORTANT: this is REALLY BAD code but cannot be bothered writing a store
     * the value 19 is based off of "/(admin)/dashboard/"
     * AND WILL BREAK if the route is modified.
     */

    $: currentPage = $page.route.id.slice(19);
</script>

<svelte:head>
    <title>CubeClubs NZ Dashboard</title>
</svelte:head>


<div class="container">
    <div class="sidebar">
        <img src={logo} alt="" style:height=36px style:margin-bottom=48px />

        <SidebarTab iconName=deployed_code label=Meetups isActive={currentPage === "meetups"} perform={() => { goto("/dashboard/meetups") }} />
        <SidebarTab iconName=group label=Users isActive={currentPage === "users"} perform={() => { goto("/dashboard/users") }} />

        <div class="sidebar-dummy" style:flex-grow=10></div>

        <SidebarTab iconName=exit_to_app label="Return to CubeClubs" perform={() => { goto("/") }} />
    </div>

    <div class="content">
        <slot/>
    </div>
</div>


<style>
    .container {
        display: grid;
        grid-template-columns: 364px 1fr;
        height: 100dvh;
        overflow-y: hidden;


    }

    .sidebar {
        grid-column: 1;

        display: flex;
        flex-direction: column;

        row-gap: 16px;

        background-color: white;

        box-shadow: 0px 2px 12px 0px #10151B29; /* cdg3, 16% */


        align-items: flex-start;

        padding-left: 32px;
        padding-right: 32px;
        padding-top: 48px;
        padding-bottom: 48px;

        width: 300px;

    }

    .content {
        grid-column: 2;
    }
</style>
