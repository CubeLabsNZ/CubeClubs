<script lang="ts"> 
    export let type: ButtonType = ButtonType.Bordered, size: ButtonSize = ButtonSize.Regular;
    export let fillWidth = false;
    export let padding = 12;
</script>


<script context="module" lang="ts">
    export enum ButtonType {
        Bordered="bordered",
        Simple="simple",
        Coloured="coloured",
        TextOnly="textonly"
    }

    export enum ButtonSize {
        Small,
        Regular
    }
</script>


<div 
    class={"button button-"+type + `${size == ButtonSize.Small ? " fsize-subhead" : " fsize-body"}`}
    style:height={size == ButtonSize.Small ? "30px" : "34px"} 
    style:--p={padding}px
    style:width={fillWidth ? "100%" : "fit-content"}>
    <slot/>
</div>


<style> 
    .button {
        background-color: white;
        border-radius: 6px;

        padding-left: var(--p);
        padding-right: var(--p);

        transition: background-color var(--v-animation-delay) ease-in-out,
                    box-shadow var(--v-animation-delay) ease-in-out,
                    color var(--v-animation-delay) ease-in-out;

        color: var(--c-dg2);

        display: grid;
        align-items: center;
        justify-content: center;

        cursor: pointer;
    }

    
    /* INFO: bordered button */
    .button-bordered {
        border: var(--c-lg1) 1px solid;
        box-shadow: 0px 1px 4px 0px #10151B1F; /* cdg3, 12% */
    }

    /* INFO: coloured button */
    .button-coloured {
        background-color: var(--c-la2);
        color: var(--c-a);
        box-shadow: 0px 1px 4px 0px #0073E61F; /* ca, 12% */
    }

    /* INFO: no background */
    .button-textonly {
        color: var(--c-a);
        background: none;
        box-shadow: none;
    }


    /* INFO: hover states */
    .button-regular:hover {
        background-color: var(--c-lg1);
    }

    .button-bordered:hover {
        color: black;
        box-shadow: 0px 1px 6px 0px #10151B29; /* cdg3, 16% */
    }

    .button-coloured:hover {
        box-shadow: 0px 1px 7px 0px #0073E633; /* ca, 20% */
    }
</style>
