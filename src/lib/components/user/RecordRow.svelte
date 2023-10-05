<script lang="ts">
    export let record: { single: number; average: number };
    export let name: string;
    export let shortname: string;
    export let bg: string;
    export let fg: string;

    import Badge, { BadgeSize } from "$lib/components/global/Badge.svelte";
</script>

<div title={`Single: ${record.single}
Average: ${record.average}`}>
    <Badge size={BadgeSize.Small} {bg} {fg} label={shortname} />

    <p style:font-weight="500">{record.single + record.average}</p>
    <p>{name}</p>
</div>

<style>
    div {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 12px;
    }
</style>
