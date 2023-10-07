<script lang="ts"> 
    import AuthCard from "$lib/components/auth/AuthCard.svelte";
    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";
    import Form from "$lib/components/global/Form.svelte";

    export let data;
    export let form;
</script>

<div>
    <Breadcrumb paths={[
        { name: "Your Profile", href: `/user/${data.user.id}` },
        { name: "Edit", href: `/user/edit` },
        { name: "Change Email", href: "/user/edit/email"}
    ]} />

    <div style:height=16px />

    <AuthCard title="Update Account Email" subtitle=""> 
        <Form name="Update Email">
            <div>
                <label class="form-label">
                    Current Email
                    <input required name="current" type="text" value={form?.current ?? ""} data-error={form?.error === "current"}>
                </label>

                {#if form?.error === "current"}
                    <p class="fsize-subhead" style:color=var(--c-red)>the entered email is not the email address associated with this account. please try again.</p>
                {/if}
            </div>


            <div>
                <label class="form-label">
                    New Email
                    <input required name="new" type="text" value={form?.new ?? ""} data-error={form?.error === "new"}>
                </label>

                {#if form?.error === "new"}
                    <p class="fsize-subhead" style:color=var(--c-red)>there is already an account associated with this email. please choose another email, or <a style:font-weight=500 style:color=var(--c-red) href="/login">login</a>.</p>
                {/if}
            </div>


            <div>
                <label class="form-label">
                    Password
                    <input required name="password" type="password" data-error={form?.error === "password"}>
                </label>

                {#if form?.error === "password"}
                    <p class="fsize-subhead" style:color=var(--c-red)>the entered password is incorrect. please try again.</p>
                {/if}
            </div>

        </Form>
    </AuthCard>
</div>
