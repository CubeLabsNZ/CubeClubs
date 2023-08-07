<script lang="ts">
    export let heading: string, subheading = "";
    export let top = 126; /* tab bar + 32px either side */
</script>


<div class="content" style:margin-top={top}px style:padding-bottom=64px> 
    <h1 class="fstyle-heading" style:padding-bottom=8px>{heading}</h1>

    {#if subheading != ""}
        <h3 class="fstyle-subheading" style:padding-bottom=32px>{subheading}</h3>
    {/if}

    <slot/>
</div>


<style>
    .content {
        margin-left: auto;
        margin-right: auto;

        width: 1000px;
    }

    @media(max-width: 1040px) {
        .content {
            margin-left: 20px;
            margin-right: 20px;
            width: calc(100% - 40px);
        }
    }
</style>
