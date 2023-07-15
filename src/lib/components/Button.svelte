<script lang="ts"> 
    export let type: ButtonType, size: ButtonSize, href: string;

    const onClick = () => {
        if (href !== "") {
            window.open(href, "_self");
        }
    }
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



<button class={"button button-"+type + `${size == ButtonSize.Small ? " fsize-subhead" : " fsize-body"}`} on:click={ onClick } style:height={size == ButtonSize.Small ? "30px" : "34px"}>
    <slot></slot>
</button>

<style> 
    .button {
        margin: 0;
        padding: 0;
        background-color: var(--cw);
        border: 0;
        border-radius: 6px;

        padding-left: 12px;
        padding-right: 12px;
        
        transition: background-color 100ms ease-in-out,
                    box-shadow 150ms ease-in-out;

        color: var(--cdg2);

        font-weight: 600;
    }

    .button:hover {
        cursor: pointer;
    }

    .button-regular:hover,
    .button-bordered:hover {
        background-color: var(--clg1);
    }

    .button-coloured {
        background-color: var(--cla2);
        color: var(--ca);
        box-shadow: 0px 2px 6px 0px #0073E61F; /* ca, 12% */
    }

    .button-coloured:hover {
        box-shadow: 0px 3px 8px 0px #0073E629; /* ca, 16% */
    }
</style>
