<script lang="ts"> 
    import Button, { ButtonType } from "./Button.svelte";

    interface FormValue {
        name: string;
        type: string;
    }

    export let formValues: FormValue[];

    function sentenceCase(word: string) {
        return word.charAt(0).toUpperCase() + word.substr(1);
    }
</script>

<form id="form" method="POST"> 
    {#each formValues as { name, type }}
        <label>
            {sentenceCase(name)}
            <input {name} {type}>
        </label>
    {/each}

    <Button type={ButtonType.Coloured} href="">
        <p>Log in</p>
    </Button>
</form>


<style> 
    form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 2px;

        font-size: 12px;
        font-weight: 600;
    }
</style>
