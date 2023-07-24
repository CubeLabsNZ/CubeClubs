<script>
    import Button, { ButtonSize, ButtonType } from "$lib/components/global/Button.svelte";
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
            <h1><span style:color=var(--c-a)>CubeClubs</span> NZ</h1>
        </div>

        <div id="landing-subtitle">
            <h4 class="fsize-title2">We’re Aotearoa’s non-profit speedcubing clubs, comprised of six clubs throughout the country.</h4>
            <h4 class="fsize-title2">Our clubs host regular meetups for all ages and all skill levels, come join us at one of our meetups!</h4>
        </div>

        <a href="/meetups">
            <Button type={ButtonType.Coloured} size={ButtonSize.Regular}>
                <div id="landing-button">
                    <p>Explore our meetups</p>
    
                    <span class="material-symbols-outlined" style:font-size=20px>chevron_right</span>
                </div>
            </Button>
        </a>
    </div>

    <img id="landing-clubs" src="/landing/clubs.webp" alt="">


    <div class="footer">
        <!-- TODO: link github when public -->
        <a href="https://www.github.com" style:height=18px>
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 28 28" style="enable-background:new 0 0 28 28;" xml:space="preserve" height=18px style:height=18px>
                <style type="text/css">
                    .st0{fill-rule:evenodd;clip-rule:evenodd;fill:var(--c-lg1);}
                </style>
                <path class="st0" d="M14,0.2C6.3,0.2,0,6.5,0,14.3c0,6.2,4,11.5,9.6,13.4c0.7,0.1,1-0.3,1-0.7c0-0.3,0-1.4,0-2.6
                    c-3.9,0.8-4.7-1.7-4.7-1.7c-0.6-1.6-1.6-2.1-1.6-2.1c-1.3-0.9,0.1-0.9,0.1-0.9c1.4,0.1,2.2,1.4,2.2,1.4c1.3,2.1,3.3,1.5,4.1,1.2
                    c0.1-0.9,0.5-1.5,0.9-1.9c-3.1-0.3-6.4-1.5-6.4-7c0-1.5,0.6-2.8,1.4-3.8C6.4,9.5,5.9,8,6.7,6.1c0,0,1.2-0.4,3.9,1.4
                    c1.1-0.3,2.3-0.5,3.5-0.5c1.2,0,2.4,0.2,3.5,0.5c2.7-1.8,3.9-1.4,3.9-1.4c0.8,1.9,0.3,3.4,0.1,3.7c0.9,1,1.4,2.2,1.4,3.8
                    c0,5.4-3.3,6.6-6.4,7c0.5,0.4,1,1.3,1,2.6c0,1.9,0,3.4,0,3.9c0,0.4,0.3,0.8,1,0.7C24,25.9,28,20.6,28,14.3C28,6.5,21.7,0.2,14,0.2z"
                />
            </svg>
        </a>

        <hr>

        <p> © 2023 Tim Xie, CubeClubs NZ. All rights reserved.  </p>
    </div>
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
        fill: var(--c-a);

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
        color: var(--c-dg1);
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

        grid-template-rows: 1fr 128px;

        height: 100dvh;
        overflow: hidden;
    }

    .footer {
        display: flex;
        align-items: center;

        height: 24px;
        
        z-index: 10;
        margin-left: min(125px, 10vw);
    }

    .footer * {
        font-size: 14px;
        color: var(--c-lg1);
    }

    hr {
        margin: 0;
        padding: 0;

        height: 16px;
        margin-left: 12px;
        margin-right: 12px;

        border: none;
        border-right: 1px var(--c-lg1) solid;
    }
</style>
