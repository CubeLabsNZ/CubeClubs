<script lang="ts">
    export let name: string;
    export let value: string | number | undefined = undefined;
</script>


<div style:display=grid>
    <select required {name} bind:value>
        <slot/>
    </select>

    <span class="material-symbols-outlined">expand_more</span>
</div>


<style>
    div {
        display: grid;
    }

    select {
        grid-area: 1/1;
    }

    span {
        align-self: center;
        justify-self: flex-end;
        padding-right: 4px;
        grid-area: 1/1;
        pointer-events: none;
    }
</style>
