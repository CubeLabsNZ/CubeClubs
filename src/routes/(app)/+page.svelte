<script lang="ts">
    import Button, {
        ButtonSize,
        ButtonType,
    } from "$lib/components/global/Button.svelte";

    import ClubCard from "$lib/components/landing/ClubCard.svelte";

    import iconASC from "$lib/assets/club-icons/ICON-ASC.webp";
    import iconCHCH from "$lib/assets/club-icons/ICON-CHCH.webp";
    import iconDUN from "$lib/assets/club-icons/ICON-DUN.webp";
    import iconKAP from "$lib/assets/club-icons/ICON-KAP.webp";
    import iconMAN from "$lib/assets/club-icons/ICON-MAN.webp";
    import iconTAR from "$lib/assets/club-icons/ICON-TAR.webp";
</script>

<svelte:head>
    <title>CubeClubs NZ</title>
</svelte:head>

<div id="landing-main" aria-hidden>
    <div id="landing-bg">
        <img id="landing-b-1" src="/landing/blob-blue.webp" alt="" />
        <img id="landing-b-2" src="/landing/blob-green.webp" alt="" />
        <img id="landing-b-3" src="/landing/blob-orange.webp" alt="" />
    </div>

    <div id="landing-clubs-grid">
        <ClubCard
            clubName="Dunedin Speedcubers"
            clubLocation="Dunedin, Otago"
            clubLogo={iconDUN}
        />


        <ClubCard
            clubName="Auckland Speedcubing Club"
            clubLocation="Auckland"
            clubLogo={iconASC}
        />


        <ClubCard
            clubName="Christchurch Speedcubers"
            clubLocation="Christchurch, Canterbury"
            clubLogo={iconCHCH}
        />

        <ClubCard
            clubName="Manawatū Cubers"
            clubLocation="Palmerston North, Manawatū"
            clubLogo={iconMAN}
        />

        <ClubCard
            clubName="Kāpiti Cubers"
            clubLocation="Kāpiti Coast, Wellington"
            clubLogo={iconKAP}
        />

        <ClubCard
            clubName="Taranaki Cubers"
            clubLocation="New Plymouth, Taranaki"
            clubLogo={iconTAR}
        />
    </div>

    <div id="landing-content">
        <div class="expand-dummy" />

        <div class="text-wrapper" style:position="relative">
            <div id="landing-title">
                <h2>Welcome to</h2>
                <h1><span style:color="var(--c-a)">CubeClubs</span> NZ</h1>
            </div>

            <div id="landing-subtitle">
                <h4 class="fsize-title2">
                    We’re Aotearoa’s non-profit speedcubing clubs, comprised of
                    six clubs throughout the country.
                </h4>
                <h4 class="fsize-title2">
                    Our clubs host regular meetups for all ages and all skill
                    levels, come join us at one of our meetups!
                </h4>
            </div>

            <a href="/meetups" style:display="block" style:width="fit-content">
                <Button type={ButtonType.Coloured} size={ButtonSize.Regular}>
                    <div id="landing-button" style:margin="0" style:padding="0">
                        <p>Explore our meetups</p>

                        <span
                            class="material-symbols-outlined"
                            style:font-size="20px">chevron_right</span
                        >
                    </div>
                </Button>
            </a>

            <div id="text-background" />
        </div>

        <div class="expand-dummy" />
    </div>

    <div class="footer">
        <a
            href="https://github.com/CubeClubsNZ/app"
            aria-label="CubeClubs source code (GitHub)"
            target="_blank"
            class="hoverable-link"
            style:height="18px"
            style:fill="var(--c-lg1)"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 28 28"
                height="18px"
                style:height="18px"
            >
                <path
                    class="st0"
                    d="M14,0.2C6.3,0.2,0,6.5,0,14.3c0,6.2,4,11.5,9.6,13.4c0.7,0.1,1-0.3,1-0.7c0-0.3,0-1.4,0-2.6
                    c-3.9,0.8-4.7-1.7-4.7-1.7c-0.6-1.6-1.6-2.1-1.6-2.1c-1.3-0.9,0.1-0.9,0.1-0.9c1.4,0.1,2.2,1.4,2.2,1.4c1.3,2.1,3.3,1.5,4.1,1.2
                    c0.1-0.9,0.5-1.5,0.9-1.9c-3.1-0.3-6.4-1.5-6.4-7c0-1.5,0.6-2.8,1.4-3.8C6.4,9.5,5.9,8,6.7,6.1c0,0,1.2-0.4,3.9,1.4
                    c1.1-0.3,2.3-0.5,3.5-0.5c1.2,0,2.4,0.2,3.5,0.5c2.7-1.8,3.9-1.4,3.9-1.4c0.8,1.9,0.3,3.4,0.1,3.7c0.9,1,1.4,2.2,1.4,3.8
                    c0,5.4-3.3,6.6-6.4,7c0.5,0.4,1,1.3,1,2.6c0,1.9,0,3.4,0,3.9c0,0.4,0.3,0.8,1,0.7C24,25.9,28,20.6,28,14.3C28,6.5,21.7,0.2,14,0.2z"
                />
            </svg>
        </a>

        <hr />

        <p>
            © 2023 <a
                href="https://tim-xie.com"
                target="_blank"
                class="hoverable-link">Tim Xie</a
            >, CubeClubs NZ.
        </p>
    </div>
</div>

<style>
    #landing-main {
        height: 100dvh;
        overflow: hidden;
        position: relative;
    }

    #landing-content {
        position: absolute;

        display: flex;
        flex-direction: column;

        width: fit-content;
        box-sizing: border-box;

        height: 100%;

        padding-top: 100px;
        padding-bottom: 100px;
        padding-left: max(20px, min(80px, 8.8vw - 40px));
        padding-right: max(20px, min(80px, 8.8vw - 40px));

        flex-shrink: 0;

        z-index: 4;
    }

    .expand-dummy {
        flex-grow: 1;
    }

    #landing-clubs-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;

        margin-left: 2%;
        margin-right: 25%;
        margin-top: -24%;
        margin-bottom: -14%;

        transform-style: preserve-3d;
        transform: rotateX(55deg) rotateZ(37deg);

        gap: 48px;

        flex-shrink: 1;

        position: fixed;
        right: -100px;
        bottom: -150px;

        z-index: 1;
    }

    #landing-button {
        display: flex;
        gap: 16px;
        align-items: center;
    }

    #landing-title,
    #landing-subtitle {
        display: flex;
        flex-direction: column;
    }

    #landing-title {
        gap: 4px;
        display: block;
        margin-bottom: max(
            min(60px, 4vh),
            20px
        ); /* 64px adjusted for font descenders */
    }

    #landing-title h1 {
        line-height: 0.8;

        font-size: min(72px, 15vw);
        font-family: "TwCenMt";
        font-weight: 600;
    }

    #landing-title h2 {
        line-height: 1.4;

        font-size: min(48px, 10vw);
        font-weight: 600;
    }

    #landing-subtitle {
        gap: 16px;
        margin-bottom: 30px; /* 32px adjusted for font descenders */
        width: min(550px, 40vw);
    }

    #landing-title *,
    #landing-subtitle * {
        padding: 0;
        margin: 0;
    }

    h4 {
        font-weight: 400;
        color: var(--c-dg1);
    }

    .text-wrapper {
        padding: 20px;
        border-radius: 8px;
    }

    .text-wrapper > *:not(#text-background) {
        position: relative;
        z-index: 2;
    }

    @supports (-webkit-mask-composite: source-in) or (mask-composite: source-in) {
        #text-background {
            z-index: 1;
            --sz: 160px;
            background-color: #ffffff80;

            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);

            position: absolute;
            inset: calc(var(--sz)*-1) calc(var(--sz)*-1) calc(var(--sz)*-1) calc(var(--sz)*-1);

            -webkit-mask: linear-gradient(
                    to top,
                    transparent 0,
                    #fff var(--sz) calc(100% - var(--sz)),
                    transparent 100%
                ),
                linear-gradient(
                    to left,
                    transparent 0,
                    #fff var(--sz) calc(100% - var(--sz)),
                    transparent 100%
                );
            -webkit-mask-size: 100% 100%;
            -webkit-mask-position: center;
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-composite: source-in;

            mask: linear-gradient(
                    to top,
                    transparent 0,
                    #fff var(--sz) calc(100% - var(--sz)),
                    transparent 100%
                ),
                linear-gradient(
                    to left,
                    transparent 0,
                    #fff var(--sz) calc(100% - var(--sz)),
                    transparent 100%
                );
            mask-size: 100% 100%;
            mask-position: center;
            mask-repeat: no-repeat;
            mask-composite: source-in;
        }
    }

    #landing-bg {
        height: 100dvh;

        position: fixed;
        z-index: -1;

        grid-area: 1/1;
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

    .footer {
        display: flex;
        align-items: center;

        position: fixed;

        bottom: 32px;
        margin-left: max(20px, min(110px, 8.8vw - 40px));
    }

    /* INFO: footer */
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

    .hoverable-link {
        transition: color var(--v-animation-delay) ease-in-out;
    }

    .hoverable-link:hover {
        color: var(--c-lg2);
    }

    .hoverable-link svg {
        transition: fill var(--v-animation-delay) ease-in-out;
    }

    .hoverable-link:hover svg {
        fill: var(--c-lg2);
    }

    @media (max-width: 1000px) {
        #landing-clubs-grid {
            display: none;
        }
    }

    @media (max-width: 550px) {
        #landing-subtitle {
            width: 100%;
        }
    }

    @media (max-height: 550px) {
        .footer {
            display: none;
        }
    }
</style>
