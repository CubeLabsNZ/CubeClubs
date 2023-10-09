<script lang="ts">
    import { ChevronDown } from "lucide-svelte";

    export let name: string;
    export let value: string | number | undefined = undefined;
</script>


<div style:display=grid>
    <select required {name} bind:value>
        <slot/>
    </select>

    <ChevronDown class="select-icon"/>
</div>


<style>
    select {
        grid-area: 1/1;

        padding-right: 32px;
    }

    :global(.select-icon) {
        font-size: 18px;
        align-self: center;
        justify-self: flex-end;
        padding-right: 4px;
        grid-area: 1/1;
        pointer-events: none;
    }
</style>
