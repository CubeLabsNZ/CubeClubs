<script lang="ts"> 
    export let name: string;
    export let fillWidth = true;

    import Button, { ButtonType, ButtonSize } from "$lib/components/global/Button.svelte";
</script>

<form method="POST"> 
    <slot/>

    <button style:margin-top=16px>
        <Button type={ButtonType.Coloured} size={ButtonSize.Regular} {fillWidth}>
            <p style:font-weight=500>{name}</p>
        </Button>
    </button>
</form>


<style> 
    form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
    }
</style>
