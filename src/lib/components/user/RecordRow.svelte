<script lang="ts">
    export let record: {single: number, average: number}
    export let name: string
    export let shortname: string
    export let bg: string
    export let fg: string

    import Badge, { BadgeSize } from "$lib/components/global/Badge.svelte"
</script>

<Badge size={BadgeSize.Small} bg={bg} fg={fg} label={shortname}/>

<p style:font-weight=500>{record.single + record.average}</p>
<p>{name}</p>

