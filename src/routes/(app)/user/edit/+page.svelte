<script lang="ts"> 
    import AuthCard from "$lib/components/auth/AuthCard.svelte";
    import Button from "$lib/components/global/Button.svelte";
    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";
    import { ChevronRight, KeyRound, Mail, SquareAsterisk } from "lucide-svelte";

    export let data;
</script>

<div class="parent-div">
    <Breadcrumb paths={[
        { name: "Your Profile", href: `/user/${data.user.id}` },
        { name: "Edit", href: `/user/edit` },
    ]} />

    <div style:height=16px />

    <AuthCard title="Edit Account Details" subtitle="If you need to change your name or region, please contact your club organiser."> 
        <div style:display=flex style:flex-direction=column style:row-gap=16px>
            <a href="/user/edit/password">
                <Button fillWidth={true}>
                    <div class="button-inner" style:padding-right=8px>
                        <KeyRound size="16px" />
                        <p style:margin-left=8px>Update Password</p>

                        <div style:flex-grow=10></div>

                        <ChevronRight size="14px" />
                    </div>
                </Button>
            </a>


            <a href="/user/edit/email">
                <Button fillWidth={true}>
                    <div class="button-inner" style:padding-right=8px>
                        <Mail size="16px" />

                        <p style:margin-left=8px>Update Email</p>

                        <div style:flex-grow=10></div>

                        <ChevronRight size="14px" />
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

    .parent-div {
        width: min(350px, calc(100% - 40px));
    }
</style>

