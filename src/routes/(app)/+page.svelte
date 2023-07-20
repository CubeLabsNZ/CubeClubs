<script>
    import Button, { ButtonSize, ButtonType } from "$lib/components/Button.svelte";

    import { goto } from "$app/navigation";
</script>

<svelte:head>
    <title>CubeClubs NZ</title>
</svelte:head>

<div id="landing-main">
    <div id="landing-bg">
        <img id="landing-b-1" src="/landing/blob-blue.webp" alt="">
        <img id="landing-b-2" src="/landing/blob-green.webp" alt="">
        <img id="landing-b-3" src="/landing/blob-orange.webp" alt="">
    </div>

    <div id="landing-content">
        <div id="landing-title">
            <h2>Welcome to</h2>
            <h1><span style:color=var(--ca)>CubeClubs</span> NZ</h1>
        </div>

        <div id="landing-subtitle">
            <h4 class="fsize-title2">We’re Aoteroa’s non-profit speedcubing clubs, comprised of six clubs throughout the country.</h4>
            <h4 class="fsize-title2">Our clubs host regular meetups for all ages and all skill levels, come join us at one of our meetups!</h4>
        </div>

        <Button size={ButtonSize.Regular} type={ButtonType.Coloured} perform={() => { goto("/meetups") }}>
            <div id="landing-button">
                <p>Explore our meetups</p>

                <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.025 5.5L0 1.475L1.225 0.25L6.475 5.5L1.225 10.75L0 9.525L4.025 5.5Z" fill="#0073E6"/>
                </svg>
            </div>
        </Button>
    </div>

    <img id="landing-clubs" src="/landing/clubs.webp" alt="">
</div>


<style>
    #landing-clubs {
        z-index: -1;
        position: fixed;

        --_clubs-width: min(1800px, 85vw);

        bottom: calc(-0.1 * var(--_clubs-width));
        right: calc(-0.1 * var(--_clubs-width));
        width: var(--_clubs-width);
    }

    #landing-button {
        fill: var(--ca);

        padding-right: 6px;
        padding-left: 6px;

        display: flex;
        gap: 16px;
        align-items: center;
    }

    h1 {
        font-size: 72px;
        font-family: "TwCenMt";
        font-weight: 600;
    }

    h2 {
        font-size: 48px;
        font-weight: 600;
    }

    #landing-title,
    #landing-subtitle {
        display: flex;
        flex-direction: column;
    }

    #landing-title {
        gap: 4px;
        margin-bottom: 60px;  /* 64px adjusted for font descenders */
    }

    #landing-subtitle {
        gap: 16px;
        margin-bottom: 30px; /* 32px adjusted for font descenders */
    }

    #landing-title *,
    #landing-subtitle * {
        padding: 0;
        margin: 0;
    }

    h4 {
        font-weight: 400;
        width: min(550px, 40vw);
        color: var(--cdg1);
    }

    #landing-content {
        margin-left: min(125px, 10vw);
        margin-top: min(250px, 25vh);

        z-index: 2;
    }





    #landing-bg {
        height: 100dvh;

        position: fixed;
        z-index: -2;
    }

    #landing-b-1,
    #landing-b-2,
    #landing-b-3 {
        position: fixed;
    }
    
    #landing-b-1 {
        width: 800px;

        top: -350px;
        left: -100px;
    }

    #landing-b-2 {
        width: 700px;

        left: 25vw;

        bottom: -300px;
    }

    #landing-b-3 {
        width: 600px;

        right: -200px;
    }

    #landing-main {
        display: grid;

        height: 100dvh;
        overflow: hidden;
    }
</style>
