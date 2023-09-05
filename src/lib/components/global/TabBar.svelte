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
        border-bottom: 1px solid var(--c-lg1);
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

        cursor: pointer;

        color: var(--c-dg1);
        fill: var(--c-dg1);
    }

    button * {
        transition: color var(--v-animation-delay) ease-in-out;
    }

    button[data-current=true] {
        border-bottom: 2px solid var(--c-a);
    }

    button[data-current=true] * {
        font-weight: 500;
        color: var(--c-a);
    }


    button:hover {
        color: var(--c-dg2);
    }
</style>
