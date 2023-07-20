<script lang="ts">
    import { goto } from "$app/navigation";

    import DetailPage from "$lib/components/DetailPage.svelte";

    import Bar from "$lib/components/Bar.svelte";

    import puzzles from "$lib/data/puzzles";



    const meetupDetail = {
        date: { month: "JUL", day: "22" },
        name: "ASC NxPyraminx Open 2023",
        club: "Auckland Speedcubing Club",
        puzzles: Object.entries(puzzles).slice(0, 4)
    };

</script>


<svelte:head>
    <title>Meetups</title>
</svelte:head>


<DetailPage
    heading="Meetups"
    subheading="We welcome cubers of all skill levels! Most of our meetups are casual get-togethers, but will be in the format of WCA competitions.">

    <h3 class="fsize-title2" style:font-weight=500 style:margin-bottom=4px>Upcoming Meetups</h3>

    <div class="meetup-list">
        {#each Array(3) as _, i}
            <button on:click={() => { goto(`/meetups/${i}`) }}>
                <Bar height={60}> 
                    <div class="meetup-detail">
                        <div class="date" data-current=true>
                            <p class="fsize-footnote" style:margin-bottom=-1px>{meetupDetail.date.month}</p>
                            <p class="fsize-title2" style:margin-top=-2px>{meetupDetail.date.day}</p>
                        </div>

                        <hr class="line">

                        <div class="title">
                            <p class="fsize-body">{meetupDetail.name}</p>
                            <p class="fsize-subhead">{meetupDetail.club}</p>
                        </div>

                        <div class="events">
                            {#each meetupDetail.puzzles as [_, { icon }]}
                            <img src={icon} alt="">
                                {/each}
                        </div>

                        <div class="arrow">
                            <span class="material-symbols-outlined">chevron_right</span>
                        </div>
                    </div>
                </Bar>
            </button>
        {/each}
    </div>


    <h3 class="fsize-title2" style:font-weight=500 style:margin-bottom=4px style:margin-top=48px>Past Meetups</h3>

    <div class="meetup-list">
        {#each Array(3) as _, i}
            <button on:click={() => { goto(`/meetups/${i}`) }}>
                <Bar height={60}> 
                    <div class="meetup-detail">
                        <div class="date" data-current=false>
                            <p class="fsize-footnote" style:margin-bottom=-1px>{meetupDetail.date.month}</p>
                            <p class="fsize-title2" style:margin-top=-2px>{meetupDetail.date.day}</p>
                        </div>

                        <hr class="line">

                        <div class="title">
                            <p class="fsize-body">{meetupDetail.name}</p>
                            <p class="fsize-subhead">{meetupDetail.club}</p>
                        </div>

                        <div class="events">
                            {#each meetupDetail.puzzles as [_, { icon }]}
                            <img src={icon} alt="">
                                {/each}
                        </div>

                        <div class="arrow">
                            <span class="material-symbols-outlined">chevron_right</span>
                        </div>
                    </div>
                </Bar>
            </button>
        {/each}
    </div>
</DetailPage>


<style>
    button {
        padding: 0;
        margin: 0;
        background-color: transparent;
        border: none;
    }



    .meetup-detail {
        display: grid;
        width: 100%;

        align-items: center;

        grid-template-columns: [date] 56px [line] 1px [title] 2fr [events] 1fr [arrow] 56px [end];
    }

    .meetup-list {
        display: flex;
        flex-direction: column;

        row-gap: 16px;
    }

    .date[data-current=true] {
        color: var(--ca)
    }

    .date {
        grid-area: date;
        color: var(--cdg2);

        display: flex;
        flex-direction: column;

        align-items: center;
    }

    .date * {
        font-weight: 500;
    }


    .line {
        grid-area: line;

        border: none;
        border-right: 1.5px solid var(--clg1);
        width: 1.5px;

        height: 100%;
    }

    .title {
        padding-left: 16px;

        grid-area: title;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .title p:first-child {
        font-weight: 600;
        color: var(--cdg2);
    }

    .title p:last-child {
        font-weight: 500;
        color: var(--cdg1);
    }



    .events {
        grid-area: events;

        display: flex;
        flex-direction: row;
        align-items: center;

        justify-content: flex-end;
        column-gap: 4px;
    }

    .events img {
        height: 28px;
        filter: invert(48%) sepia(8%) saturate(177%) hue-rotate(169deg) brightness(95%) contrast(84%);  /* g */
    }

    .arrow {
        grid-area: arrow;

        display: grid;
        justify-self: end;
        padding-right: 8px;

        color: var(--cdg2);
    }
</style>
