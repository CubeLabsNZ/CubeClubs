<script lang="ts">
    export let size: BadgeSize = BadgeSize.Regular;

    export let fg: string, bg: string;

    export let label: string;
</script>

<script context="module" lang="ts">
    export enum BadgeSize {
        Regular,
        Small
    }
</script>


<div 
    class="outer" 
    style:height={`${size == BadgeSize.Regular ? 20 : 16}px`}
    style:background-color={bg}>

    <p style:font-size={`${size == BadgeSize.Regular ? 12 : 10}px`} style:color={fg} style:font-weight=600> {label} </p>
</div>

<style>
    .outer {
        display: grid;
        align-items: center;
        width: fit-content;
        padding-left: 6px;
        padding-right: 6px;
        border-radius: 4px;
    }
</style>
