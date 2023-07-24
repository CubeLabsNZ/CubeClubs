<script lang="ts"> 
    import type { ActionData } from "./$types";

    import Card from "$lib/components/Card.svelte";
    import Form from "$lib/components/Form.svelte";

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
                <p class="fsize-subhead" style:color=var(--c-red)>this email doesn't exist. please try again</p>
            {/if}
        </div>


        <div>
            <label class="form-label"> 
                <div class="pass-flex">
                    <div> Password </div>
                    <a href="recover-account">Forgot your password?</a>
                </div>

                <input name="password" type="password" data-error={form?.error === "pass"}>
            </label>

            {#if form?.error === "pass"}
                <p class="fsize-subhead" style:color=var(--c-red)>password is incorrect. please try again</p>
            {/if}
        </div>


    </Form>

    <p class="fsize-subhead" style:margin-top=8px> Need an account? <a href=" /signup "> Sign up </a> </p>
</Card>


<style>
    p {
        color: var(--c-g);
    }

    a {
        text-decoration: none;
        color: var(--c-a);
        font-weight: 400;
    }

    .pass-flex {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    }
</style>
