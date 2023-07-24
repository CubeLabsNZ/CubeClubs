<script lang="ts">
    import Calendar from "@event-calendar/core";
    import Interaction from "@event-calendar/interaction";
    import TimeGrid from "@event-calendar/time-grid";

    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";

    let events = [{
        "title": "new event",
        "start": "2023-07-23T18:30:00.000Z",
        "end": "2023-07-24T05:00:00.000Z"
    }];

    let plugins = [TimeGrid, Interaction];

    let options;
    let evcal;

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
