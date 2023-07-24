<script lang="ts">
    export let clubName: string, clubLocation: string;
</script>

<div class="card">
    {clubName}
    {clubLocation}
</div>

<style>
    .card {
        width: 250px;
        height: 350px;

        background-color: white;
        border-radius: 12px;

        transform: rotateX(31deg) rotateY(-10deg) rotateZ(23deg);

        box-shadow: 48px 64px 48px 0px #10151B15;
    }
</style>
