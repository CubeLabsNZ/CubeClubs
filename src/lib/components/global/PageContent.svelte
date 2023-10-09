<script lang="ts">
    export let heading: string, subheading = "";
    export let top = 100; /* tab bar + enough to make it look good */
    export let isDashboard = false;
</script>


<div class="page-content" data-isDashboard={isDashboard} style:padding-top={top}px style:padding-bottom=64px> 
    <h1 class="fstyle-heading" style:padding-bottom=8px>{heading}</h1>

    {#if subheading != ""}
        <h3 class="fstyle-subheading" style:padding-bottom=32px>{subheading}</h3>
    {/if}

    <slot/>
</div>


<style>
    .page-content {
        margin-left: auto;
        margin-right: auto;

        width: 1000px;
    }

    @media(max-width: 1040px) {
        .page-content {
            margin-left: 20px;
            margin-right: 20px;
            width: calc(100% - 40px);
        }
    }

    @media(max-width: 1400px) {
        .page-content[data-isDashboard=true] {
            margin-left: 50px;
            margin-right: 50px;
            width: calc(100% - 100px);
        }
    }

    @media(max-width: 550px) {
        .page-content[data-isDashboard=true] {
            margin-left: 20px;
            margin-right: 20px;
            width: calc(100% - 40px);
        }
    }
</style>
