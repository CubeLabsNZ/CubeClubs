<script lang="ts">
    export let height: number | null = null, width: number | null = null;
    export let clickable: bool = true;
</script>

<div class="container" 
    style:height={height != null ? `${height}px` : "auto"}
    style:width={width != null ? `${width}px` : "auto"}
    data-clickable={clickable}>
    <slot></slot>
</div>

<style> 
    .container {
        margin: 0;
        padding: 0;
        background-color: white;
        border: 0;
        border-radius: 6px;

        border: var(--c-lg1) 1px solid;
        transition: box-shadow var(--v-animation-delay) ease-in-out;

        display: grid;
        align-items: center;
    }

    .container[data-clickable=true] {
        box-shadow: 0px 1px 4px 0px #10151B1F; /* cdg3, 12% */

        cursor: pointer;
    }

    .container[data-clickable=true]:hover {
        box-shadow: 0px 1px 6px 0px #10151B29; /* cdg3, 16% */
    }
</style>
