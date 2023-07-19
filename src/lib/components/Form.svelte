<script lang="ts"> 
    export let name: string;

    import Button, { ButtonType, ButtonSize } from "$lib/components/Button.svelte";
</script>

<form method="POST"> 
    <slot/>

    <Button type={ButtonType.Coloured} size={ButtonSize.Regular}>
        <p style:font-weight=500>{name}</p>
    </Button>
</form>


<style> 
    form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
    }
</style>
