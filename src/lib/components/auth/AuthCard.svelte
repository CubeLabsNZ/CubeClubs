<script lang="ts"> 
    export let title: string, subtitle: string;
    import iconText from "$lib/assets/logo-text-dark.svg";
</script>


<div id="wrapper">
    <a href="/"> 
        <img src={iconText} alt="" height=36/>
    </a>

    <p id="title" class="fsize-title2">{title}</p>
    <p id="subtitle" class="fsize-body">{subtitle}</p>

    <slot></slot>
</div>


<style> 
    #wrapper {
        width: 350px;
        height: 600px;
        /* background-color: white; */
        /* box-shadow: 0 4px 8px 0px #10151B29; */
        /* padding: 16px; */
        /* border-radius: 8px; */


        display: flex;
        flex-direction: column;

        align-items: flex-start;
    }

    #title {
        font-weight: 500;

        margin-top: 16px;
        margin-bottom: 8px;
    }

    #subtitle {
        color: var(--c-g);

        margin-bottom: 32px;
    }
</style>

