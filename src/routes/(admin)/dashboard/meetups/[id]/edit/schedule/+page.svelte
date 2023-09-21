<script lang="ts">
    import type { PageData } from "./$types";

    import Toast from "$lib/components/global/Toast.svelte";
    import Select from "$lib/components/global/Select.svelte";
    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";
    import Button, { ButtonType, ButtonSize } from "$lib/components/global/Button.svelte";
    import Card from "$lib/components/global/card/Card.svelte";


    export let data: PageData;

    import Calendar from "@event-calendar/core";
    import Interaction from "@event-calendar/interaction";
    import TimeGrid from "@event-calendar/time-grid";


    import formats from "$lib/data/formats";
    import puzzles from "$lib/data/puzzles";
    import { getRoundName } from "$lib/utils";

    let events = [];

    let plugins = [TimeGrid, Interaction];

    let options, eventCalendar, addEventCard;

    let displayingUUID: string | null = null

    // TODO: figureout figure out key in puzle
    function updateRoundFor(puzzleType: string) {
        let roundNum = 1;
        const filteredEvents = eventCalendar
            .getEvents()
            .sort((e1,e2) => e1.start - e2.start)
            .filter(x => x.extendedProps.puzzleType == puzzleType)
        for (const event of filteredEvents) {
            eventCalendar.updateEvent({
                ...event,
                title: getRoundName(puzzles[event.extendedProps.puzzleType].name, roundNum, filteredEvents.length),
            })
            roundNum++;
        }
    }

    let hasUnsavedChanges = false
    let saveFetch: Promise<Response> | null = null

    let unselectCancel = true

    let selectedFormat: string | undefined
    let selectedPuzzle: string | undefined
    $: allowedFormats = selectedPuzzle ? puzzles[selectedPuzzle].allowedFormats : []
    let proceed_number: number | undefined

    function saveChanges() {
        // TODO cancel promise and stuff
        saveFetch = fetch("./schedule/save", {
            method: "POST",
            body: JSON.stringify(eventCalendar.getEvents()),
            headers: {
                "Content-Type": "application/json"
            }
        }) 
        saveFetch.then((res) => {
            // if (res.ok) { hasUnsavedChanges = false }
            hasUnsavedChanges = false;
        })
    }

    $: {
        // TODO: need to handle resize top when/if it becomes possible
        options = {
            events: data.events,
            view: "timeGridDay",
            date: data.meetup.date,
            allDaySlot: false,
            slotDuration: {
                seconds: 900
            },
            headerToolbar: {
                start: "",
                center: "",
                end: ""
            },
            titleFormat: {day: 'numeric', month: 'short'},
            eventClassNames: "testclass",
            select: (info) => {
                displayingUUID = crypto.randomUUID()
                eventCalendar.addEvent({
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
            unselectAuto: false,
            unselect: (info) => {
                console.log("unseleect")
                if (!unselectCancel) {
                    const event = eventCalendar.getEventById(displayingUUID)
                    eventCalendar.updateEvent({
                        ...event,
                        extendedProps: {
                            puzzleType: selectedPuzzle,
                            formatType: selectedFormat,
                            proceed_number: proceed_number
                        }
                    })
                    updateRoundFor(selectedPuzzle!)
                    hasUnsavedChanges = true
                } else {
                    eventCalendar.removeEventById(displayingUUID)
                }

                addEventCard.style.display = "none";

                selectedPuzzle = undefined
                selectedFormat = undefined
                proceed_number = undefined
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

<svelte:window 
    on:beforeunload={(e) => {
        if (hasUnsavedChanges) {
            e.preventDefault()
        }
    }}
></svelte:window>

<Breadcrumb paths={[
    {name: "Meetups", href: "/dashboard/meetups"},
    {name: data.meetup.name, href: `/dashboard/meetups/${data.meetup.id}/`},
    {name: "Edit Schedule", href: `/dashboard/meetups/${data.meetup.id}/edit/schedule`}
]} />

<Calendar bind:this={eventCalendar} {plugins} {options} />

<div bind:this={addEventCard} class="add-event-card">
    <Card width={300} clickable={false}> 
        <div style:padding=12px>
            <p class="fsize-title2" style:font-weight=500 style:margin-bottom=32px> Add Event </p>

            <div class="label-group">
                <p class="label">Event</p>

                <Select name="event" bind:value={selectedPuzzle}>
                    <option disabled selected value>Select an event</option>

                    {#each Object.entries(puzzles) as [type, { name }]}
                        <option value={type}>{name}</option>
                    {/each}
                </Select>
            </div>



            <div class="label-group" style:padding-top=16px>
                <p class="label">Format</p>

                <Select name="format" bind:value={selectedFormat}>
                    <option disabled selected value>Select a round format</option>

                    {#each allowedFormats as format}
                        <option value={format}>{formats[format].name}</option>
                    {/each}
                </Select>
            </div>

            <div class="label-group" style:padding-top=16px style:padding-bottom=32px>
                <p class="label"> Number to Proceed </p>

                <input required name="numberProceed" bind:value={proceed_number} />
            </div>

            <div style:display=flex style:gap=8px style:justify-content=flex-end>
                <button on:click={() => {
                        unselectCancel = true
                        eventCalendar.unselect()
                    }}>
                    <Button>
                        <div style:display=flex style:align-items=center style:gap=4px>
                            <span class="material-symbols-outlined" style:margin-left=-4px style:font-size=24px>cancel</span>

                            <p>Cancel</p>
                        </div>
                    </Button>
                </button>

                <button  on:click={() => {
                        unselectCancel = false
                        eventCalendar.unselect()
                    }}>
                    <Button>
                        <div style:display=flex style:align-items=center style:gap=4px>
                            <span class="material-symbols-outlined" style:margin-left=-4px style:font-size=24px>done</span>

                            <p> Add Event </p>
                        </div>
                    </Button>
                </button>
            </div>
        </div>
    </Card>
</div>

{#if hasUnsavedChanges}
    <Toast> 
        <p>Unsaved Changes!</p>
        <button on:click={saveChanges}>
            <Button type={ButtonType.TextOnly} size={ButtonSize.Regular}>
                Save
            </Button>
        </button>
    </Toast>
{/if}



<style>
    .add-event-card {
        position: fixed;
        display: none;
        z-index: 2000;
    }
</style>
