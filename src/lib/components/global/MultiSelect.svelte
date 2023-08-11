<!-- WARN: this is pretty much entirely duplicated from multibutton -> can combine base template -->

<script lang="ts">
    export let selectedIndices = new Set();

    export let padding = 12;

    export let labels: Label[];

    export let fixedHeight = true;
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


<div class="container" style:--p={padding}px style:height={fixedHeight ? "34px" : "auto"} style:flex-wrap={fixedHeight ? "nowrap" : "wrap"}>
    {#each labels as { type, data, }, i}
        <button on:click|preventDefault = { () => { 
            if (selectedIndices.has(i)) {
                selectedIndices.delete(i)
            } else {
                selectedIndices.add(i)
            }

            selectedIndices = selectedIndices
        }} data-selected={selectedIndices.has(i)}>
            {#if type == LabelType.Text}
                <p class="inner">{data}</p>
            {:else}
                <img class="inner" src={data} alt={data} height=28px/>
            {/if}
        </button>
    {/each}

    <slot/>
</div>


<style>
    /* TODO: add large/medium */
    .container {
        border: 1px var(--c-lg1) solid;
        background-color: white;
        box-shadow: 0px 1px 4px 0px #10151B1F; /* cdg3, 12% */
        width: fit-content;
        padding-left: var(--p);
        padding-right: var(--p);
        border-radius: 6px;

        display: flex;
        flex-direction: row;
        align-items: center;

        column-gap: 16px;

        padding-top: 2px;
        padding-bottom: 2px;
    }

    .container * {
        font-size: 16px;
    }

    button * {
        transition: color var(--v-animation-delay) ease-in-out,
                    filter var(--v-animation-delay) ease-in-out;
    }

    button[data-selected=true] * {
        font-weight: 500;
        color: var(--c-a);
    }

    button[data-selected=true] img {
        filter: invert(28%) sepia(92%) saturate(1649%) hue-rotate(194deg) brightness(99%) contrast(106%); /* accent */
    }

    button {
        display: grid;
        align-items: center;

        text-align: center;

        cursor: pointer;

        color: var(--c-dg1);
        fill: var(--c-dg1);
    }

    button img {
        filter: invert(30%) sepia(7%) saturate(500%) hue-rotate(164deg) brightness(94%) contrast(89%); /* dg1 */
    }

    button:hover {
        color: var(--c-dg2);
    }

    button:hover img {
        filter: invert(15%) sepia(4%) saturate(1968%) hue-rotate(169deg) brightness(93%) contrast(90%); /* dg2 */
    }

    button[data-selected=true]:hover img {
        filter: invert(28%) sepia(92%) saturate(1649%) hue-rotate(194deg) brightness(99%) contrast(106%); /* force accent if already accent */
    }


</style>

