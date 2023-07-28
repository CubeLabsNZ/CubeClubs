<script lang="ts">
    import type { ActionData } from "./$types";
    import regions from "$lib/data/regions"

    import Select from "$lib/components/global/Select.svelte";
    import AuthCard from "$lib/components/auth/AuthCard.svelte";
    import Form from "$lib/components/global/Form.svelte";

    export let form: ActionData;
</script>

<AuthCard title="Sign up to CubeClubs NZ" subtitle="Create your CubeClubs account to register for meetups and be notified of upcoming events."> 
    <Form name="Sign up">
        <div>
            <label class="form-label"> 
                Email
                <input required name="email" type="email" value={form?.email ?? ""} data-error={form?.error === "EMAIL"}>
            </label>

            {#if form?.error === "EMAIL"}
                <p class="fsize-subhead" style:color=var(--c-red)>whoops, an account with this email already exists.</p>
            {/if}
        </div>

        <div>
            <label class="form-label">
                Full Name
                <input required name="fullName" type="text" value={form?.fullName ?? ""}>
            </label>
        </div>

        <div>
            <label class="form-label"> 
                Password
                <input required name="password" type="password" data-error={form?.error === "PASS_MISMATCH"}>
            </label>
        </div>

        <div>
            <label class="form-label"> 
                Confirm Password
                <input required name="confirmPassword" type="password" data-error={form?.error === "PASS_MISMATCH"}>
            </label>

            {#if form?.error === "PASS_MISMATCH"}
                <p class="fsize-subhead" style:color=var(--c-red)>the two passwords you've entered don't match.</p>
            {/if}
        </div>

        <label class="form-label">
            Region

            <Select name="region" value={form?.region}>
                <option disabled selected value>Select a Region</option>
                {#each Object.entries(regions) as [value, {name, maori_name}] }
                    <option value={value}>{name} {maori_name !== undefined ? `(${maori_name})` : ""}</option>
                {/each}
            </Select>

        </label>
    </Form>

    <p class="fsize-subhead" style:margin-top=8px> Already have an account? <a href=" /login "> Login </a> </p>
</AuthCard>


<style>
    p {
        color: var(--c-g);
    }

    a {
        text-decoration: none;
        color: var(--c-a);
    }
</style>
