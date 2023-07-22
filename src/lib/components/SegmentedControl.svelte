<script lang="ts">
    export let selectedIndex = 0;

    export let padding: number = 12;

    export let labels: Label[];
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


<div class="container" style:--p={padding}px>
    {#each labels as { type, data, }, i}
        <button on:click|preventDefault = { () => { 
            selectedIndex = i
        }} data-current={i == selectedIndex}>
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
        height: 34px;
        border: 1px var(--clg1) solid;
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

    }

    .container * {
        font-size: 16px;
    }

    button * {
        transition: color 150ms ease-in-out,
                    filter 150ms ease-in-out;
    }

    button[data-current=true] * {
        font-weight: 500;
        color: var(--ca);
    }

    button[data-current=true] img {
        filter: invert(28%) sepia(92%) saturate(1649%) hue-rotate(194deg) brightness(99%) contrast(106%); /* accent */
    }

    button {
        display: grid;
        align-items: center;

        text-align: center;

        padding: 0;
        margin: 0;

        cursor: pointer;

        background: none;
        border: none;

        color: var(--cdg1);
        fill: var(--cdg1);
    }

    button img {
        filter: invert(30%) sepia(7%) saturate(500%) hue-rotate(164deg) brightness(94%) contrast(89%); /* dg1 */
    }

    button:hover {
        color: var(--cdg2);
    }

    button:hover img {
        filter: invert(15%) sepia(4%) saturate(1968%) hue-rotate(169deg) brightness(93%) contrast(90%); /* dg2 */
    }

    button[data-current=true]:hover img {
        filter: invert(28%) sepia(92%) saturate(1649%) hue-rotate(194deg) brightness(99%) contrast(106%); /* force accent if already accent */
    }


</style>
