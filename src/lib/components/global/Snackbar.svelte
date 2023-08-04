<script lang="ts">
    import { fly, fade } from "svelte/transition";
</script>


<div 
    class="snackbar" 
    in:fly={{ delay: 50, duration: 250, x: 400}}
    out:fade={{ duration: 150 }}>
    <slot/>
</div>


<style>
    .snackbar {
        position: fixed;

        height: 42px;

        top: 16px;
        right: 16px;
        padding-top: 4px;
        padding-bottom: 4px;
        padding-left: 12px;
        padding-right: 12px;

        border-radius: 6px;

        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;

        background-color: white;
        box-shadow: 0px 1px 6px 0px #10151B29; /* cdg3, 16% */
    }
</style>
