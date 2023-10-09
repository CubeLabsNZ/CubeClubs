<script lang="ts">
    export let clubName: string, clubLocation: string, clubLogo: string;

    export let href="";
</script>

<div class="card">
    <img class="club-logo" src={clubLogo} alt="" style:flex-grow=10 style:width=100% style:object-fit=cover>

    <div style:display=inherit style:flex-direction=inherit style:align-items=flex-begin style:width=100%>
        <p class="club-name"> {clubName} </p>
        <p class="fsize-subhead club-location"> {clubLocation} </p>
    </div>
</div>

<style>
    .card {
        user-select: none;

        width: min(250px, 16vw);

        /* If we do need to shrink, dont distort! */
        aspect-ratio: 250 / 350;

        background-color: white;
        border-radius: 12px;

        display: flex;
        flex-direction: column;
        align-items: center;

        padding: min(24px, 1.35vw);

        box-shadow: 64px 64px 48px 0px #10151B15;

        transition: box-shadow 200ms ease-in-out,
                    transform 200ms ease-out;

        grid-row: span 2;
    }

    .card:first-child {
        grid-row: 2 /  span 2;
    }

    .club-name {
        font-size: min(19px, 1.08vw);
        font-weight: 600;
        color: var(--c-dg2);
    }

    .club-location {
        font-size: min(16px, 0.85vw);
        margin-top: 4px;
        color: var(--c-a);
    }

    .club-name, .club-location {
        transition: color var(--v-animation-delay) ease-in-out;
    }

    /* NOTE: re-enable when club pages added */
    /*
    .card:hover {
        transform: rotateZ(-37deg) rotateX(-55deg) translateY(-150px);
        box-shadow: 0px 16px 32px 0px #10151B18;
    }
    */

    .card:hover .club-name {
        color: var(--c-dg3);
    }
</style>
