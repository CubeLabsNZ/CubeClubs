<script lang="ts"> 
    export let type: ButtonType, href: string;

    const onClick = () => {
        if (href === "") {
            window.open(href, "_self");
        }
    }
</script>


<script context="module" lang="ts">
    export enum ButtonType {
        Bordered,
        Regular,
        Coloured
    }
</script>


{#if type === ButtonType.Bordered}
    <button class="button" id="b-button" on:click={ onClick }>
        <div class="inner">
            <slot></slot>
        </div>
    </button>
{:else if type === ButtonType.Regular}
    <button class="button" id="r-button" on:click={ onClick }>
        <div class="inner">
            <slot></slot>
        </div>
    </button>
{:else}
    <button class="button" id="c-button" on:click={ onClick }>
        <div class="inner">
            <slot></slot>
        </div>
    </button>
{/if}


<style> 
    .button {
        margin: 0;
        padding: 0;
        height: 30px;
        background-color: var(--cw);
        border: 0;
        border-radius: 6px;

        padding-left: 12px;
        padding-right: 12px;
        
        transition: background-color 100ms ease-in-out;

        color: var(--cdg2);
    }

    .button:hover {
        cursor: pointer;
        background-color: var(--clg1);
    }

    .inner {
        font-size: 14px;
        font-weight: 600;
    }

    #c-button {
        background-color: var(--cla2);
        color: var(--ca);
        box-shadow: 0px 2px 6px 0px #0073E61F;
    }
</style>
