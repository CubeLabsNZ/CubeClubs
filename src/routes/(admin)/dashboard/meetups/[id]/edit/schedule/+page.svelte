<script lang="ts">
    import Calendar from "@event-calendar/core";
    import Interaction from "@event-calendar/interaction";
    import TimeGrid from "@event-calendar/time-grid";

    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";

    import Card from "$lib/components/global/card/Card.svelte";

    import puzzles from "$lib/data/puzzles";
    import type { Puzzle } from '@prisma/client'

    let events = [];

    let plugins = [TimeGrid, Interaction];

    let options;
    let evcal;



    let addEventCard;

    let displayingUUID: string | null = null
    
    // TODO: figureout figure out key in puzle
    function updateRoundFor(puzzleType: string) {
        let roundNum = 1;
        for (const event of evcal.getEvents().sort((a,z) => a.start - z.start).filter(x => x.extendedProps.puzzleType == puzzleType)) {
            evcal.updateEvent({
                ...event,
                title: `${puzzles[event.extendedProps.puzzleType].name} - Round ${roundNum}`,
            })
            roundNum++;
        }
    }

    let hasUnsavedChanges = false

    $: {
        // TODO: need to handle resize top when/if it becomes possible
        options = {
            events: events,
            view: "timeGridDay",
            allDaySlot: false,
            slotDuration: {
                seconds: 900
            },
            headerToolbar: {
                start: "",
                center: "",
                end: ""
            },
            select: (info) => {
                displayingUUID = crypto.randomUUID()
                evcal.addEvent({
                    id: displayingUUID,
                    start: info.start,
                    end: info.end,
                    extendedProps: {}
                })


                // TODO: try to use position relative to the event to make it scroll with the event itself
                addEventCard.style.display = "block";

                addEventCard.style.top = `${info.jsEvent.clientY}px`;
                addEventCard.style.left = `${info.jsEvent.clientX}px`;
            },
            unselect: (info) => {
                const puzzleType = info.jsEvent.target.dataset.puzzleType
                if (puzzleType) {
                    const event = evcal.getEventById(displayingUUID)
                    evcal.updateEvent({
                        ...event,
                        extendedProps: {
                            puzzleType
                        }
                    })
                    updateRoundFor(puzzleType)
                    hasUnsavedChanges = true
                } else {
                    evcal.removeEventById(displayingUUID)
                }
                addEventCard.style.display = "none";
            },
            eventDrop: (info) => {
                // Update all round numbers
                updateRoundFor(info.event.extendedProps.puzzleType)
                hasUnsavedChanges = true
            },
            selectable: true,
        }
    }
</script>


<Breadcrumb paths={[
    {name: "Meetups", href: "/dashboard/meetups"},
    {name: "Meetup Name", href: `/dashboard/meetups/4/`},
    {name: "Edit Schedule", href: `/dashboard/meetups/4/edit-schedule`}
]} />

<Calendar bind:this={evcal} {plugins} {options} />

<div bind:this={addEventCard} class="add-event-card">
    <Card clickable={false}> 
        <div>
            <p class="fsize-body" style:font-weight=500> Add Event </p>

            {#each Object.entries(puzzles) as [type, {name, icon}]}
            <div class="label-group">
                <p class="label" data-puzzle-type={type}>{name}</p>
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
