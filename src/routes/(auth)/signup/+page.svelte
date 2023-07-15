<script lang="ts">
    import type { ActionData } from "./$types";
    import regions from "$lib/data/regions"

    import Form from "$lib/components/Form.svelte";
    import Card from "$lib/components/Card.svelte";

    export let form: ActionData;
</script>

<Card title="Sign up to CubeClubs NZ" subtitle="Create your CubeClubs account to register for meetups and be notified of upcoming events."> 
    <form method="POST"> 
        <label>
            email
            <input name="email" type="email">
        </label>

        <label> 
            password
            <input name="password" type="password">
        </label>

        <label>
            confirm password
            <input name="confirmPassword" type="password">
        </label>

        <label>
            region
            <select name="region">
                <option disabled selected value></option>
                {#each Object.entries(regions) as [value, {name, maori_name}] }
                    <option value={value}>{name} ({maori_name})</option>
                {/each}
            </select>
        </label>


        {#if form}
            {#if form.success}
                <p> success </p>
            {:else}
                <p> errored... with message {form?.message} </p>
            {/if}
        {/if}

        <button> sign up </button>
    </form>


    <p class="fsize-subhead" style:margin-top=8px> Already have an account? <a href=" /login "> Login </a> </p>
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
