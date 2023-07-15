<script lang="ts"> 
    export let title: string, subtitle: string;
    import iconText from "$lib/assets/logo-text-dark.svg";
</script>


<div id="wrapper">
    <img src={iconText} alt="" height=36/>
    <p id="title" class="fsize-title2">{title}</p>
    <p id="subtitle" class="fsize-body">{subtitle}</p>

    <slot></slot>
</div>


<style> 
    #wrapper {
        width: 350px;

        /* background-color: white; */
        /* box-shadow: 0 4px 8px 0px #10151B29; */
        /* padding: 16px; */
        /* border-radius: 8px; */


        display: flex;
        flex-direction: column;

        align-items: flex-start;
    }

    #title {
        font-weight: 600;

        margin-top: 16px;
        margin-bottom: 8px;
    }

    #subtitle {
        font-weight: 500;
        color: var(--cg);

        margin-bottom: 32px;
    }
</style>

