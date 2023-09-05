<script lang="ts"> 
    import AuthCard from "$lib/components/auth/AuthCard.svelte";
    import Button from "$lib/components/global/Button.svelte";
    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";

    export let data;
</script>

<div>
    <Breadcrumb paths={[
        { name: "Your Profile", href: `/user/${data.user.id}` },
        { name: "Edit", href: `/user/edit` },
    ]} />

    <div style:height=16px />

    <AuthCard title="Edit Account Details" subtitle="If you need to change your name or region, please contact your club organiser."> 
        <div style:display=flex style:flex-direction=column style:row-gap=16px>
            <a href="/user/edit/password">
                <Button fillWidth={true}>
                    <div class="button-inner">
                        <span class="material-symbols-outlined" style:font-size=16px style:font-weight=600 style:padding-right=8px>key</span>

                        <p>Update Password</p>

                        <div style:flex-grow=10></div>

                        <span class="material-symbols-outlined" style:font-size=16px style:font-weight=600 style:padding-right=8px>chevron_right</span>
                    </div>
                </Button>
            </a>


            <a href="/user/edit/email">
                <Button fillWidth={true}>
                    <div class="button-inner">
                        <span class="material-symbols-outlined" style:font-size=16px style:font-weight=600 style:padding-right=8px>email</span>

                        <p>Update Email</p>

                        <div style:flex-grow=10></div>

                        <span class="material-symbols-outlined" style:font-size=16px style:font-weight=600 style:padding-right=8px>chevron_right</span>
                    </div>
                </Button>
            </a>
        </div>
    </AuthCard>
</div>

<style>
    .button-inner {
        display: flex;
        align-items: center;
        column-gap: 8px;
        justify-content: space-between;

        width: calc(350px - 2*12px);
    }
</style>

