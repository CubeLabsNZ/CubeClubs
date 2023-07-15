<script lang="ts"> 
    import Button, { ButtonType, ButtonSize } from "./Button.svelte";

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

    <Button type={ButtonType.Coloured} size={ButtonSize.Regular} href="">
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

        font-size: 14px;
        font-weight: 600;
    }

    label:last-of-type {
        margin-bottom: 16px;
    }

    input {
        height: 32px;
        border: var(--clg1) 1.5px solid;
        outline: 0;
        border-radius: 6px;
        background-color: var(--clg0);

        color: var(--cdg1);

        font-size: 16px;
        font-size: 500;

        caret-color: var(--ca);

        padding-left: 6px;
        padding-right: 6px;

        transition: background-color 100ms ease-in-out, color 100ms ease-in-out;
    }

    input:focus, input:active {
        border: var(--clg1) 1.5px solid;
        outline: 0;

        color: var(--cdg2);
        background-color: white;
    }

    #padding {
        margin-top: 12px;
    }
</style>
