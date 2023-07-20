<script lang="ts">
    export let height: number;
</script>

<div class="container" style:height={`${height}px`}>
    <slot></slot>
</div>

<style> 
    .container {
        margin: 0;
        padding: 0;
        background-color: white;
        border: 0;
        border-radius: 6px;

        border: var(--clg1) 1px solid;
        box-shadow: 0px 1px 4px 0px #10151B1F; /* cdg3, 12% */

        transition: box-shadow 150ms ease-in-out;

        display: grid;
        align-items: center;

        cursor: pointer;
    }

    .container:hover {
        box-shadow: 0px 1px 6px 0px #10151B29; /* cdg3, 16% */
    }
</style>
