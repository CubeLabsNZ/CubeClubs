<script lang="ts">
    export let selectedIndex = 0;

    export let labels: string[];
</script>

<div class="container">
    <div class="tabs">
        {#each labels as label, i}
            <button on:click|preventDefault = { () => { 
                selectedIndex = i
            }} data-current={i == selectedIndex}>
                <p class="inner">{label}</p>
            </button>
        {/each}
    </div>

    <slot/>
</div>


<style>
    .container {
        border-bottom: 1px solid var(--clg1);
        height: 34px;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .tabs {
        display: flex;
        flex-direction: row;
        align-items: flex-end;

        column-gap: 24px;
    }

    .tabs * {
        font-size: 16px;
    }

    button {
        height: 34px;

        display: grid;
        align-items: grid-end;

        text-align: center;

        padding: 0;
        margin: 0;

        cursor: pointer;

        background: none;
        border: none;

        color: var(--cdg1);
        fill: var(--cdg1);
    }

    button * {
        transition: color 150ms ease-in-out;
    }

    button[data-current=true] * {
        font-weight: 500;
        color: var(--ca);

        border-bottom: 2px solid var(--ca);
    }


    button:hover {
        color: var(--cdg2);
    }
</style>
