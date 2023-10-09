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
        width: 250px;
        height: 350px;

        /* If we do need to shrink, dont distort! */
        aspect-ratio: 250 / 350;

        background-color: white;
        border-radius: 12px;

        display: flex;
        flex-direction: column;
        align-items: center;

        padding: 24px;

        box-shadow: 64px 64px 48px 0px #10151B15;

        transition: box-shadow 200ms ease-in-out,
                    transform 200ms ease-in-out;

        grid-row: span 2;
    }

    .card:first-child {
        grid-row: 2 /  span 2;
    }

    .club-name {
        font-size: 19px;
        font-weight: 600;
        color: var(--c-dg2);
    }

    .club-location {
        margin-top: 4px;
        color: var(--c-a);
    }

    .club-name, .club-location {
        transition: color var(--v-animation-delay) ease-in-out;
    }

    .card:hover {
        transform: rotateZ(-37deg) rotateX(-55deg) translateY(-150px);

        /* box-shadow: 88px 88px 64px 0px #10151B18; */
        box-shadow: 0px 16px 32px 0px #10151B18;
    }

    .card:hover .club-name {
        color: var(--c-dg3);
    }
</style>
