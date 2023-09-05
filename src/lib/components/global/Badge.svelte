<script lang="ts">
    export let size: BadgeSize = BadgeSize.Regular;

    export let fg: string, bg: string;

    export let label: string;
    export let fontFamily = "IBMPlexSans";
</script>

<script context="module" lang="ts">
    export enum BadgeSize {
        Regular,
        Small,
        Large
    }
</script>


<div 
    class="outer" 
    style:height={`${size == BadgeSize.Regular ? 20 : (size == BadgeSize.Large ? 24 : 16)}px`}
    style:background-color={bg}>

    <slot/>
    <p style:font-size={`${size == BadgeSize.Regular ? 12 : (size == BadgeSize.Large ? 14 : 10)}px`} style:color={fg} style:font-weight=600 style:font-family={fontFamily}> {label} </p>
</div>

<style>
    .outer {
        display: flex;
        align-items: center;
        width: fit-content;
        padding-left: 6px;
        padding-right: 6px;
        border-radius: 4px;
    }
</style>
