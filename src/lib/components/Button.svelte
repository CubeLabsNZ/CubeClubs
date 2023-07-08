<script lang="ts"> 
    export let type: ButtonType, href: string;
</script>


<script context="module" lang="ts">
    export enum ButtonType {
        Bordered,
        Regular
    }
</script>


{#if type === ButtonType.Bordered}
    <button class="button" id="b-button" type="button" on:click={() => { window.open(href, "_self") }}>
        <div class="inner">
            <slot></slot>
        </div>
    </button>
{:else}
    <button class="button" id="r-button" type="button" on:click={() => { window.open(href, "_self") }}>
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
    }

    .button:hover {
        cursor: pointer;
        background-color: var(--clg1);
    }

    .inner {
        color: var(--cdg2);
        font-size: 14px;
        font-weight: 600;
    }
</style>
