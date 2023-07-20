<script lang="ts">
    export let heading: string, subheading: string;
</script>


<div class="content"> 
    <h1 class="fstyle-heading" style:padding-bottom=8px>{heading}</h1>

    <h3 class="fstyle-subheading" style:padding-bottom=32px>{subheading}</h3>

    <slot/>
</div>


<style>
    .content {
        width: 1000px;
        margin-left: auto;
        margin-right: auto;

        margin-top: 126px; /* tab bar + 32px either side */
    }

    h1 {
        transform: translateX(-2px);
    }
</style>
