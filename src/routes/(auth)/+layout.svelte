<script lang="ts"> 
    import "$styles/fonts.css";
    import "$styles/globals.css";
    import "$styles/components.css";
</script>


<div id="main"> 
    <div style:width='min(350px, calc(100% - 40px))'>
        <slot/>
    </div>
</div>


<style> 
    #main {
        margin: 0;
        padding: 0;

        display: grid;
        align-items: center;
        justify-items: center;

        box-sizing: border-box;

        height: 100vh;
        width: 100%;
    }
</style>
