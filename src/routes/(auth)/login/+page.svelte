<script lang="ts"> 
    import type { ActionData } from "./$types";

    import Card from "$lib/components/Card.svelte";
    import Form from "$lib/components/Form.svelte";

    export let form: ActionData;
</script>


<Card title="Login to CubeClubsNZ" subtitle="Login to your CubeClubs account to register for meetups."> 
    <Form formValues={
        [{name: "email", type: "email"}, {name: "password", type: "password"}]
        }></Form>

    <p class="fsize-subhead" style:margin-top=8px> Need an account? <a href=" /signup "> Sign up </a> </p>

    {#if form}
        {#if form.success}
            <p> sdlkfjSDKLFJSDKLFLOGGED IN!!!!!!!!!!!!!!!!!! </p>
        {:else}
            <p> {form.message} </p>
        {/if}
    {/if}
</Card>

<style>
    p {
        color: var(--cg);
    }

    a {
        text-decoration: none;
        color: var(--ca);
    }
</style>
