<script lang="ts"> 
    import iconText from "$lib/assets/logo-text-dark.svg";

    import Form from "$lib/components/Form.svelte";
</script>

<!-- <input bind:value={username} /> -->
<!-- <input bind:value={password} /> -->

<div id="main"> 
    <div id="wrapper">
        <img src={iconText} alt="" height=30/>

        <p id="title">Login to CubeClubs</p>

        <p id="subtitle">Login to your CubeClubs account to register for meetups.</p>

        <Form formValues={
            [{name: "email", type: "email"}, {name: "password", type: "password"}]
        }></Form>
    </div>
</div>



<style> 
    #main {
        display: grid;
        align-items: center;
        justify-items: center;

        height: 100dvh;
        width: 100%;
    }

    #wrapper {
        width: 300px;

        display: flex;
        flex-direction: column;

        align-items: flex-start;
    }

    #title {
        font-size: 16px;
        font-weight: 600;

        margin-top: 16px;
        margin-bottom: 8px;
    }

    #subtitle {
        font-size: 14px;
        font-weight: 500;
        color: var(--cg);

        margin-bottom: 32px;
    }
</style>
