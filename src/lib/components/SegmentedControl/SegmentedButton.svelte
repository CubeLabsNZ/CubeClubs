<script lang="ts">
    import { getContext } from 'svelte';

    export let index: number;

    const context = getContext("container");
</script>

<button on:click on:click|preventDefault = { () => { 
        context.setIndex(index); 
    }}>
    <slot/>
</button>



<style>
    button {
        background: none;
        border: none;
    }

    button:hover {
        color: red;
    }
</style>
