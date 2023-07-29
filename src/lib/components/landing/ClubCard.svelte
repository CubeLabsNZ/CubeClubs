<script lang="ts">
    export let clubName: string, clubLocation: string, clubLogo: string;
    export let transform;

    export let href="";
    export let clubInnerDiv;
</script>

<a {href}> 
    <div class="card" style:transform bind:this={clubInnerDiv}>
        <img src={clubLogo} alt="" style:flex-grow=10 style:width=100% style:object-fit=cover>

        <div style:display=inherit style:flex-direction=inherit style:align-items=flex-begin style:width=100%>
            <p class="fsize-title2 club-name"> {clubName} </p>
            <p class="fsize-subhead club-location"> {clubLocation} </p>
        </div>
    </div>
</a>

<style>
    .card {
        width: 250px;
        height: 350px;

        background-color: white;
        border-radius: 12px;

        display: flex;
        flex-direction: column;
        align-items: center;

        padding: 24px;

        box-shadow: 0px 24px 48px 0px #10151B15;

        transition: box-shadow var(--v-animation-delay) ease-in-out;

    }

    .club-name {
        font-weight: 500;
        color: var(--c-dg2);
    }

    .club-location {
        margin-top: 4px;
        color: var(--c-a);
    }

    .club-name, .club-location {
        transition: color var(--v-animation-delay) ease-in-out;
    }

    a:hover .card {
        box-shadow: 0px 32px 64px 0px #10151B18;
    }

    a:hover .club-name {
        color: var(--c-dg3);
    }
</style>
