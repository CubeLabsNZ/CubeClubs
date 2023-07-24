<script lang="ts">
    import Calendar from "@event-calendar/core";
    import Interaction from "@event-calendar/interaction";
    import TimeGrid from "@event-calendar/time-grid";

    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";

    import Card from "$lib/components/global/card/Card.svelte";

    let events = [{
        "title": "new event",
        "start": "2023-07-23T18:30:00.000Z",
        "end": "2023-07-24T05:00:00.000Z"
    }];

    let plugins = [TimeGrid, Interaction];

    let options;
    let evcal;


    let addEventCard;

    $: {
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
                evcal.addEvent({
                    title: "new event",
                    start: info.start,
                    end: info.end
                })

                addEventCard.style.display = "block";

                console.log(info.jsEvent);
                addEventCard.style.top = `${info.jsEvent.clientY}px`;
                addEventCard.style.left = `${info.jsEvent.clientX}px`;
            },
            unselect: () => {
                addEventCard.style.display = "none";
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

            <div class="label-group">
                <p class="label">Event</p>
            </div>
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
