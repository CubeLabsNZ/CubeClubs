<script lang="ts"> 
    import type { ActionData } from "./$types";


    import Form from "$lib/components/Form.svelte";

    export let form: ActionData;
</script>


<Form formValues={
    [{name: "email", type: "email"}, {name: "password", type: "password"}]
    }></Form>

{#if form}
    {#if form.success}
        <p> sdlkfjSDKLFJSDKLFLOGGED IN!!!!!!!!!!!!!!!!!! </p>
    {:else}
        <p> ;((:(:(:(::( )))))) </p>
    {/if}
{/if}
