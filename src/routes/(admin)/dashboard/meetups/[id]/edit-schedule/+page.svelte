<script lang="ts">
    import Calendar from "@event-calendar/core";
    import Interaction from "@event-calendar/interaction";
    import TimeGrid from "@event-calendar/time-grid";

    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";

    import Card from "$lib/components/global/card/Card.svelte";
    import puzzles from "$lib/data/puzzles";

    let events = [];

    let plugins = [TimeGrid, Interaction];

    let options;
    let evcal;

    let addEventCard: HTMLDivElement;
    let selectingEventId: string | undefined;

    $: {
        options = {
            events: events,
            view: "timeGridDay",
            allDaySlot: false,
            slotDuration: {
                seconds: 900,
            },
            headerToolbar: {
                start: "",
                center: "",
                end: "",
            },
            select: (info) => {
                selectingEventId = crypto.randomUUID();
                evcal.addEvent({
                    id: selectingEventId,
                    title: "",
                    start: info.start,
                    end: info.end,
                });

                addEventCard.style.display = "block";

                addEventCard.style.top = `${info.jsEvent.clientY}px`;
                addEventCard.style.left = `${info.jsEvent.clientX}px`;
            },
            unselect: (event) => {
                const selectedPuzzle = event.jsEvent.target.dataset.puzzleType
                if (selectedPuzzle) {
                    evcal.updateEvent({
                        ...evcal.getEventById(selectingEventId),
                        id: selectingEventId,
                        extendedProps: {
                            puzzle: selectedPuzzle
                        },
                        title: `${puzzles[selectedPuzzle].name} - Round X`
                    })
                } else {
                    evcal.removeEventById(selectingEventId)
                }
                addEventCard.style.display = "none";
            },
            selectable: true,
        };
    }
    // TODO: ROUND
</script>

<Breadcrumb
    paths={[
        { name: "Meetups", href: "/dashboard/meetups" },
        { name: "Meetup Name", href: `/dashboard/meetups/4/` },
        { name: "Edit Schedule", href: `/dashboard/meetups/4/edit-schedule` },
    ]}
/>

<Calendar bind:this={evcal} {plugins} {options} />

<div bind:this={addEventCard} class="add-event-card">
    <Card clickable={false}>
        <div>
            <p class="fsize-body" style:font-weight="500">Add Event</p>

            {#each Object.entries(puzzles) as [enumval, puzzle]}
                <div class="label-group">
                    <p class="label" data-puzzle-type={enumval}>{puzzle.name}</p>
                </div>
            {/each}
        </div>
    </Card>
</div>

<style>
    .add-event-card {
        position: fixed;
        display: none;
        z-index: 999;
    }
</style>
