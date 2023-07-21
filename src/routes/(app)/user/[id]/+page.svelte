<script lang="ts">
    import Bar from '$lib/components/Bar.svelte';
    import Badge, { BadgeSize } from "$lib/components/Badge.svelte";

    export let data;
</script>

<svelte:head>
    <title>User's name</title>
</svelte:head>

<div class="container-grid">
    <div class="user-container">
        <Bar width={300} clickable={false}>
            <div style:padding=16px>
                <div class="section-column">
                    <h3 style:font-weight=500 class="fsize-title2">User's name</h3>

                    <Badge 
                        size={BadgeSize.Regular} 
                        fg=var(--cg)
                        bg=var(--clgh)
                        label="User's Region"/>

                    <Badge 
                        size={BadgeSize.Regular} 
                        fg=var(--ca)
                        bg=var(--cla1)
                        label="ASC Club Organiser"/>
                </div>

                <div class="card-column" style:margin-top=32px>
                    <div class="section-column">
                        <div class="data-row">
                            <p style:font-weight=500> XXX </p>
                            <p> Meetups Attended </p>
                        </div>

                        <div class="data-row">
                            <p style:font-weight=500> XXX </p>
                            <p> Completed Solves </p>
                        </div>
                    </div>

                    <hr>

                    <!-- INFO: gold -->
                    <div class="data-row">
                        <div class="medal-container">
                            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height=16 stroke-width=1.5 fill=#F9D953 stroke=#EFCC3A>
                                <circle cx="8" cy="8" r="6.75" />
                            </svg>

                            <p class="medal-text">1</p>
                        </div>

                        <p style:font-weight=500> XXX </p>
                        <p> Gold Medals </p>
                    </div>

                    <!-- INFO: silver -->
                    <div class="data-row">
                        <div class="medal-container">
                            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height=16 stroke-width=1.5 fill=#D3D3D3 stroke=#C4C4C4>
                                <circle cx="8" cy="8" r="6.75" />
                            </svg>

                            <p class="medal-text">2</p>
                        </div>

                        <p style:font-weight=500> XXX </p>
                        <p> Silver Medals </p>
                    </div>

                    <!-- INFO: bronze -->
                    <div class="data-row">
                        <div class="medal-container">
                            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height=16 stroke-width=1.5 fill=#F89656 stroke=#E47D43>
                                <circle cx="8" cy="8" r="6.75" />
                            </svg>

                            <p class="medal-text">3</p>
                        </div>

                        <p style:font-weight=500> XXX </p>
                        <p> Bronze Medals </p>
                    </div>

                    <hr>

                    <!-- INFO: RR -->
                    <div class="data-row">
                        <Badge size={BadgeSize.Small}>  </Badge>

                        <p style:font-weight=500> XXX </p>
                        <p> Bronze Medals </p>
                    </div>


                </div>
            </div>
        </Bar>
    </div>

    <div class="content">
        <p> hi </p>
    </div>
</div>


<style>
    .section-column, .card-column, .data-row {
        display: flex;
    }

    .section-column {
        flex-direction: column;
        row-gap: 4px;
    }

    .card-column {
        flex-direction: column;
        row-gap: 12px;
    }

    .data-row {
        flex-direction: row;
        column-gap: 12px;
    }


    .medal-container {
        display: grid;
        align-items: center;
        justify-items: center;
    }

    .medal-text {
        grid-area: 1/1;
        position: absolute;
        z-index: 2;
        font-weight: 600;
        font-size: 10px;
        color: white;
    }

    hr {
        border: none;
        border-bottom: 1.5px solid var(--clg1);
        height: 1.5px;

        width: 100%;
    }


    .container-grid {
        display: grid;
        width: 1000px;
        margin-left: auto;
        margin-right: auto;

        margin-top: 126px; /* tab bar + 32px either side */
        grid-template-columns: 300px 1fr;

        column-gap: 16px;
    }


    .user-container {
        grid-column: 1;
    }

    .content {
        grid-column: 2;
    }


</style>
