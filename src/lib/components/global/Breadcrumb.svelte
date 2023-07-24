<script lang="ts">
    export let paths: { name: string, href: string }[];
</script>

<div class="container">
    {#each paths as { name, href }, i}
        <div class="box">
            <a {href} class="container">
                {#if i == 0}
                    <span class="material-symbols-outlined" style:margin-right=4px style:font-size=18px>arrow_left_alt</span>
                {/if}

                {name}
            </a>
        </div>

        {#if i != paths.length - 1}
            <p>/</p>
        {/if}
    {/each}
</div>


<style>
    .container {
        display: flex;
        flex-direction: row;
        height: 24px;

        align-items: center;
    }

    .container *  {
        color: var(--c-dg1);
        font-size: 14px;
        font-weight: 500;
    }

    .box {
        border-radius: var(--v-border-radius-small);
        padding-left: 3px;
        padding-right: 3px;

        transition: background-color var(--v-animation-delay) ease-in-out;
    }

    .box:hover {
        background-color: var(--c-lgh);
    }

    .box:hover * {
        color: var(--c-dg2)
    }

    p {
        margin-left: 1px;
        margin-right: 1px;
    }
</style>
