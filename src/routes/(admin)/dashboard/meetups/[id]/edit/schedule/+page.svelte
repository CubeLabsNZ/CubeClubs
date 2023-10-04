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

    let deleteButton;
        
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
                title: getRoundName(puzzles[event.extendedProps.puzzleType].name, roundNum, filteredEvents.length) + (roundNum == filteredEvents.length ? "" : ` [Proceed: ${event.extendedProps.proceed_number ?? 0}]`)
            })

            roundNum++;
        }
    }

    let hasUnsavedChanges = false
    let saveFetch: Promise<Response> | null = null
    let deletedIds: string[] = []

    let unselectCancel = true

    let selectedFormat: string | undefined
    let selectedPuzzle: string | undefined
    $: allowedFormats = selectedPuzzle ? puzzles[selectedPuzzle].allowedFormats : []
    let proceed_number: number | undefined

    function saveChanges() {
        // TODO cancel promise and stuff
        saveFetch = fetch("./schedule/save", {
            method: "POST",
            body: JSON.stringify({update: eventCalendar.getEvents(), delete: deletedIds}),
            headers: {
                "Content-Type": "application/json"
            }
        }) 
        saveFetch.then((res) => {
            if (res.ok) {
                hasUnsavedChanges = false
                deletedIds = []
            }
            saveFetch = null
        })
    }

    $: {
        // TODO: need to handle resize top when/if it becomes possible
        options = {
            events: data.events,
            view: "timeGridDay",
            date: data.meetup.date,
            allDaySlot: false,
            slotMinTime: '08:00:00',
            slotMaxTime: '19:00:00',
            slotHeight: 48,
            flexibleSlotTimeLimits: true,
            slotDuration: {
                seconds: 900
            },
            headerToolbar: {
                start: "",
                center: "",
                end: ""
            },
            eventClick: function(info) {
                if (info.event.display === 'auto') {
                    let btn = info.el.querySelector('button');
                    if (info.jsEvent.target === btn) {
                        eventCalendar.removeEventById(info.event.id);
                        deletedIds.push(info.event.id)
                        hasUnsavedChanges = true
                    }
                }
            },
            titleFormat: {day: 'numeric', month: 'short'},
            eventClassNames: "testclass",
            eventBackgroundColor: "var(--c-la2)",
            eventTextColor: "var(--c-a)",
            eventMouseEnter: (info) => {
                let elRect = info.el.getBoundingClientRect();
                deleteButton.style.top = `${elRect.y + elRect.height + info.el.scrollTop}px`;
                deleteButton.style.right = "0px";
                deleteButton.style.display = "block";
            },
            eventMouseLeave: (info) => {
                deleteButton.style.display = "none";
            },
            // eventContent: (info) => info.event.display === 'auto'
            // ? {html: '<div class="ec-event-time">' + info.timeText + '</div>' +
            // (info.event.editable ? '<button>Delete</button>' : '') +
            //   '<div class="ec-event-title">' + info.event.title + '</div>'}
            // : '',
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

                const e = document.getElementsByClassName("content")[0]
                const rect = e.getBoundingClientRect();
                addEventCard.style.top = `${info.jsEvent.clientY - rect.top + e.scrollTop}px`;
                addEventCard.style.left = `${info.jsEvent.clientX - rect.left}px`;
            },
            unselectAuto: false,
            unselect: (info) => {
                console.log("unseleect")
                if (!unselectCancel) {
                    const event = eventCalendar.getEventById(displayingUUID)
                    eventCalendar.updateEvent({
                        ...event,
                        editable: true,
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
            e.preventDefault();
        }
    }}
/>

<Breadcrumb
    paths={[
        { name: "Meetups", href: "/dashboard/meetups" },
        {
            name: data.meetup.name,
            href: `/dashboard/meetups/${data.meetup.id}/`,
        },
        {
            name: "Edit Schedule",
            href: `/dashboard/meetups/${data.meetup.id}/edit/schedule`,
        },
    ]}
/>

<Calendar bind:this={eventCalendar} {plugins} {options} />

<div bind:this={addEventCard} class="add-event-card">
    <Card width={300} clickable={false}>
        <div style:padding="12px">
            <p
                class="fsize-title2"
                style:font-weight="500"
                style:margin-bottom="32px"
            >
                Add Event
            </p>

            <div class="label-group">
                <p class="label">Event</p>

                <Select name="event" bind:value={selectedPuzzle}>
                    <option disabled selected value={undefined}>Select an event</option>

                    {#each Object.entries(puzzles) as [type, { name }]}
                        <option value={type}>{name}</option>
                    {/each}
                </Select>
            </div>

            <div class="label-group" style:padding-top="16px">
                <p class="label">Format</p>

                <Select name="format" bind:value={selectedFormat}>
                    <option disabled selected value={undefined}
                        >Select a round format</option
                    >

                    {#each allowedFormats as format}
                        <option value={format}>{formats[format].name}</option>
                    {/each}
                </Select>
            </div>

            <div
                class="label-group"
                style:padding-top="16px"
                style:padding-bottom="32px"
            >
                <p class="label">Number to Proceed</p>

                <input
                    required
                    name="numberProceed"
                    bind:value={proceed_number}
                />
            </div>

            <div
                style:display="flex"
                style:gap="8px"
                style:justify-content="flex-end"
            >
                <button
                    on:click={() => {
                        unselectCancel = true;
                        eventCalendar.unselect();
                    }}
                >
                    <Button>
                        <div
                            style:display="flex"
                            style:align-items="center"
                            style:gap="4px"
                        >
                            <span
                                class="material-symbols-outlined"
                                style:margin-left="-4px"
                                style:font-size="20px">cancel</span
                            >

                            <p>Cancel</p>
                        </div>
                    </Button>
                </button>

                {@debug selectedPuzzle, selectedFormat}

                <button
                    on:click={() => {
                        unselectCancel = false;
                        eventCalendar.unselect();
                    }}
                    disabled={!selectedPuzzle || !selectedFormat}
                >
                    <Button type={!selectedPuzzle || !selectedFormat ? ButtonType.Disabled : ButtonType.Bordered}>
                        <div
                            style:display="flex"
                            style:align-items="center"
                            style:gap="4px"
                        >
                            <span
                                class="material-symbols-outlined"
                                style:margin-left="-4px"
                                style:font-size="24px">done</span
                            >

                            <p>Add Event</p>
                        </div>
                    </Button>
                </button>
            </div>
        </div>
    </Card>
</div>

{#if hasUnsavedChanges || saveFetch}
    <Toast>
        {#if hasUnsavedChanges}
            <p>Unsaved Changes!</p>
            <button on:click={saveChanges}>
                <Button type={ButtonType.TextOnly} size={ButtonSize.Regular}>
                    Save
                </Button>
            </button>
        {/if}
        {#await saveFetch}
            Saving your changes...
        {:then res}
            {#if res && !res.ok}
                Uh oh... An error occurred!
            {/if}
        {:catch e}
            Uh oh... An error occurred!
        {/await}
    </Toast>
{/if}

<div bind:this={deleteButton} class="delete-button">delete</div>

<style>
    .add-event-card {
        position: absolute;
        display: none;
        z-index: 2000;
        box-shadow: 0px 1px 6px 0px #10151B29; /* cdg3, 16% */
    }

    .delete-button {
        position: absolute;
        z-index: 2000;
    }

    :global(.ec-time),
    :global(.ec-line) {
        height: 48px; /* override this value */
    }

    :global(.ec-event-title) {
        font-size: 14px;
        font-weight: 500
    }
</style>
