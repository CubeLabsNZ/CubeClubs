<script lang="ts"> 
    import type { ActionData } from "./$types";
    import { ERR_LOGIN_EMAIL, ERR_LOGIN_PASS } from "$lib/globals";

    import Card from "$lib/components/Card.svelte";
    import Form from "$lib/components/Form/Form.svelte";

    export let form: ActionData;
</script>


<Card title="Login to CubeClubsNZ" subtitle="Login to your CubeClubs account to register for meetups."> 
    <Form name="Log in">
        <div>
            <label class="form-label"> 
                Email
                <input name="email" type="email" value={form?.email ?? ""} data-error={form?.error === "email"}>
            </label>

            {#if form?.error === "email"}
                <p class="fsize-subhead" style:color=var(--cred)>{ERR_LOGIN_EMAIL}</p>
            {/if}
        </div>


        <div>
            <label class="form-label"> 
                Password
                <input name="password" type="password" data-error={form?.error === "pass"}>
            </label>

            {#if form?.error === "pass"}
                <p class="fsize-subhead" style:color=var(--cred)>{ERR_LOGIN_PASS}</p>
            {/if}
        </div>


    </Form>

    <p class="fsize-subhead" style:margin-top=8px> Need an account? <a href=" /signup "> Sign up </a> </p>
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
