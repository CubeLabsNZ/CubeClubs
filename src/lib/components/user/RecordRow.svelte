<script lang="ts">
    type Rec = { single: number; average: number }
    export let record: Rec | Promise<Rec>;
    export let name: string;
    export let shortname: string;
    export let bg: string;
    export let fg: string;

    import Badge, { BadgeSize } from "$lib/components/global/Badge.svelte";
</script>

{#await record}
<div>
    <Badge size={BadgeSize.Small} {bg} {fg} label={shortname} />

    <p class="shimmering">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
    <p>{name}</p>
</div>
{:then rec}
<div title={`Single: ${rec.single}
Average: ${rec.average}`}>
    <Badge size={BadgeSize.Small} {bg} {fg} label={shortname} />

    <p style:font-weight="500">{rec.single + rec.average}</p>
    <p>{name}</p>
</div>
{/await}

<style>
    div {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 12px;
    }
</style>
