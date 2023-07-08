<script lang="ts"> 
    import "../../styles/globals.css";
    import "../../styles/fonts.css";

    import iconText from "$lib/assets/logo-text-dark.svg";
</script>


<div id="main"> 
    <div id="wrapper">
        <img src={iconText} alt="" height=36/>
        <p id="title">Login to CubeClubs</p>
        <p id="subtitle">Login to your CubeClubs account to register for meetups.</p>

        <slot/>
    </div>
</div>


<style> 
    #main {
        margin: 0;
        padding: 0;

        display: grid;
        align-items: center;
        justify-items: center;

        box-sizing: border-box;

        height: 100vh;
        width: 100%;
    }

    #wrapper {
        width: 350px;

        display: flex;
        flex-direction: column;

        align-items: flex-start;
    }

    #title {
        font-size: 20px;
        font-weight: 600;

        margin-top: 16px;
        margin-bottom: 8px;
    }

    #subtitle {
        font-size: 16px;
        font-weight: 500;
        color: var(--cg);

        margin-bottom: 32px;
    }
</style>
