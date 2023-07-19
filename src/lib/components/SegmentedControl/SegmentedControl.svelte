<script lang="ts">
    export let selectedIndex = 0;

    export let labels: Label[]
</script>

<script context="module" lang="ts">
    export interface Label {
        type: LabelType;
        data: string;
    }

    export enum LabelType {
        Text,
        Image
    }

</script>


<div class="container">
    {#each labels as { type, data, }, i}
        <button on:click|preventDefault = { () => { 
            selectedIndex = i
        }} data-current={i == selectedIndex}>
            {#if type == LabelType.Text}
                <p class="inner">{data}</p>
            {:else}
                <img class="inner" src={data} alt={data}/>
            {/if}
        </button>
    {/each}


    <slot/>
</div>


<style>
    /* TODO: add large/medium */
    .container {
        height: 34px;
        border: 1px var(--clg1) solid;
        background-color: white;
        box-shadow: 0px 1px 4px 0px #10151B1F; /* cdg3, 12% */
        width: fit-content;
        padding-left: 12px;
        padding-right: 12px;
        border-radius: 6px;

        display: flex;
        flex-direction: row;
        align-items: center;

        column-gap: 16px;

    }

    .container * {
        font-size: 16px;

        transition: color 150ms ease-in-out;
    }


    button[data-current=true] * {
        font-weight: 500;
        color: var(--ca);
    }


    button {
        text-align: center;

        padding: 0;
        margin: 0;

        cursor: pointer;

        background: none;
        border: none;

        color: var(--cdg1);
    }

    button:hover {
        color: var(--cdg2);
    }
</style>
