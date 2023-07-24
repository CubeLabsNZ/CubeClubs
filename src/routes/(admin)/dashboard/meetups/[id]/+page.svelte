<script lang="ts">
    import Button, { ButtonSize, ButtonType } from "$lib/components/global/Button.svelte";

    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    let isPublished = false;

    let data = {
        "user": {
            "id": 1,
            "email": "pdt.xie@gmail.com",
            "passHash": "$argon2id$v=19$m=65536,t=3,p=4$KKtLwIkehTd40KLt1R1fQQ$HxbWVSubuzung7rywa44qLY+jFHnkskZGs4CaH9xe54",
            "name": "Tim Xie",
            "region": "OTAGO",
            "gender": "MALE",
            "isClubOrganiser": true
        },
        "meetup": {
            "id": 3,
            "name": "sdfsdf",
            "venue": "sdfsdfsdfdf",
            "location": "sdfsdfdfdf",
            "description": "sdfsdfsdf",
            "contact": "sdfsdf",
            "competitorLimit": 234,
            "date": new Date("2023-07-27T00:00:00.000Z"),
            "isPublished": true,
            "clubId": 1,
            "club": {
                "id": 1,
                "name": "Auckland Speedcubing Club"
            },
            "organisers": [
                {
                    "name": "Tim Xie"
                }
            ],
            "users": []
        }
    }
</script>

<div class="button-bar">
    <!-- <span class="material-symbols-outlined">done</span> -->
    {#if isPublished}
        <button on:click={() => {isPublished = false}}>
            <Button>
                Revert to Draft
            </Button>
        </button>
        

        <a href={$page.url + "/data-entry"}>
            <Button>
                Enter Results
            </Button>
        </a>
        
    {:else}
        <button on:click={() => {isPublished = true}}>
            <Button>
                Publish Meetup
            </Button>
        </button>
    {/if}

    <hr>

    <a href={$page.url + "/edit-details"}>
        <Button>
            Edit Details
        </Button>
    </a>
    

    <a href={$page.url + "/edit-schedule"}>
        <Button>
            Edit Schedule
        </Button>
    </a>
    

    <hr>

    <Button>
        Delete Meetup
    </Button>
</div>

<h3 class="fsize-title2" style:font-weight=500 style:margin-top=32px style:margin-bottom=16px>Meetup Info</h3>

<!--  TODO: again all duplicated code -->
<div class="info-grid">
    <div class="info-left">
        <div class="label-group">
            <p class="label">Date</p>
            <p>
                {data.meetup.date.toLocaleDateString("en-NZ", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </p>
        </div>

        <div class="label-group">
            <p class="label">Venue</p>
            <p>{data.meetup.venue}</p>
        </div>

        <div class="label-group">
            <p class="label">Location</p>
            <p>{data.meetup.location}</p>
        </div>

        <div class="label-group">
            <p class="label">Organisers</p>
            <ul>
                {#each data.meetup.organisers as { name }}
                    <li>{name}</li>
                {/each}
            </ul>
        </div>

        <div class="label-group">
            <p class="label">Competitor Limit</p>
            <p>{data.meetup.competitorLimit}</p>
        </div>
    </div>

    <div class="info-right">
        <div class="label-group">
            <p class="label">Meetup Description</p>
            <p>{data.meetup.description}</p>
        </div>
    </div>
</div>



<h3 class="fsize-title2" style:font-weight=500 style:margin-top=48px style:margin-bottom=16px>Schedule</h3>


<style>
    hr {
        padding: 0;
        margin: 0;

        margin-top: auto;
        margin-bottom: auto;

        width: 1.5px;
        height: 24px;

        border: none;
        border-right: 1px solid var(--c-lg1);
    }

    .button-bar {
        display: flex;
        flex-direction: row;
        column-gap: 16px;
    }


    /* TODO: again all duplicated code */
    /* INFO: info tab */
    .info-grid {
        display: grid;
        grid-auto-columns: 1fr;
        grid-auto-flow: column;

        column-gap: 16px;
    }

    .info-left {
        grid-column: 1;
    }

    .info-right {
        grid-column: 2;
    }

    .info-left,
    .info-right {
        display: flex;
        flex-direction: column;
        row-gap: 24px;
    }
</style>
