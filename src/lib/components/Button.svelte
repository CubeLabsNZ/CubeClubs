<script lang="ts"> 
    export let type: ButtonType = ButtonType.Regular, size: ButtonSize = ButtonSize.Regular;
    export let padding = 12;

    export let perform: () => void = () => {};
</script>


<script context="module" lang="ts">
    export enum ButtonType {
        Bordered="bordered",
        Regular="regular",
        Coloured="coloured"
    }

    export enum ButtonSize {
        Small,
        Regular
    }
</script>



<button class={"button button-"+type + `${size == ButtonSize.Small ? " fsize-subhead" : " fsize-body"}`} on:click={ () => { perform() } } style:height={size == ButtonSize.Small ? "30px" : "34px"} style:--p={padding}px>
    <slot></slot>
</button>

<style> 
    .button {
        margin: 0;
        padding: 0;
        background-color: white;
        border: 0;
        border-radius: 6px;

        padding-left: var(--p);
        padding-right: var(--p);
        
        transition: background-color 150ms ease-in-out,
                    box-shadow 150ms ease-in-out,
                    color 150ms ease-in-out;

        color: var(--cdg2);

        display: grid;
        align-items: center;

        cursor: pointer;
    }

    
    /* INFO: bordered button */
    .button-bordered {
        border: var(--clg1) 1px solid;
        box-shadow: 0px 1px 4px 0px #10151B1F; /* cdg3, 12% */
    }

    /* INFO: coloured button */
    .button-coloured {
        background-color: var(--cla2);
        color: var(--ca);
        box-shadow: 0px 1px 4px 0px #0073E61F; /* ca, 12% */
    }


    /* INFO: hover states */
    .button-regular:hover {
        background-color: var(--clg1);
    }

    .button-bordered:hover {
        color: black;
        box-shadow: 0px 1px 6px 0px #10151B29; /* cdg3, 16% */
    }

    .button-coloured:hover {
        box-shadow: 0px 1px 6px 0px #0073E629; /* ca, 16% */
    }
</style>
