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
        { name: "Change Password", href: "/user/edit/password"}
    ]} />

    <div style:height=16px />

    <AuthCard title="Update Account Password" subtitle=""> 
        <Form name="Update Password" run={({ formData }) => {
            formData.set("user_id", data.user.id);
        }}>
            <div>
                <label class="form-label">
                    Current Password
                    <input required name="current" type="password" data-error={form?.error === "current"}>
                </label>

                {#if form?.error === "current"}
                    <p class="fsize-subhead" style:color=var(--c-red)>the entered password is incorrect. please try again.</p>
                {/if}
            </div>


            <div>
                <label class="form-label">
                    New Password
                    <input required name="new" type="password" data-error={form?.error === "new"}>
                </label>
            </div>


            <div>
                <label class="form-label">
                    Confirm New Password
                    <input required name="confirm" type="password" data-error={form?.error === "new"}>
                </label>

                {#if form?.error === "new"}
                    <p class="fsize-subhead" style:color=var(--c-red)>the two passwords you've entered don't match.</p>
                {/if}
            </div>

            <p>Please note: you will be logged out on all devices.</p>

        </Form>
    </AuthCard>
</div>
