<script lang="ts">
    export let paths: { name: string, href: string }[];
</script>

<div class="container">
        {#if typeof window !== "undefined" && window.history.length > 1}
            <button on:click={() => window.history.back()} class="material-symbols-outlined container2" style:margin-right=4px style:font-size=18px>arrow_left_alt</button>
        {:else}
            <a href={paths.at(-2)?.href} class="material-symbols-outlined container2" style:margin-right=4px style:font-size=18px>arrow_left_alt</a>
        {/if}
    {#each paths as { name, href }, i}
            <a {href} class="container2">
                {name}
            </a>

        {#if i != paths.length - 1}
            <div class="slash">/</div>
        {/if}
    {/each}
</div>


<style>
    .container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .container2 {
        height: 24px;
        line-height: 22px;

        border-radius: var(--v-border-radius-small);
        padding-left: 3px;
        padding-right: 3px;

        transition: background-color var(--v-animation-delay) ease-in-out;
        color: var(--c-dg1);
        font-size: 14px;
        font-weight: 500;
    }


    .container2:hover {
        color: var(--c-dg2);
        background-color: var(--c-lgh);
        cursor: pointer;
    }

    .slash {
        margin-left: 1px;
        margin-right: 1px;
    }
</style>
