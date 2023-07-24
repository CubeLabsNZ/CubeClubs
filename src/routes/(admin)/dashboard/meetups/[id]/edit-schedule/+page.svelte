<script lang="ts">
    import Calendar from "@event-calendar/core";
    import Interaction from "@event-calendar/interaction";
    import TimeGrid from "@event-calendar/time-grid";

    let events = [{
        "title": "new event",
        "start": "2023-07-23T18:30:00.000Z",
        "end": "2023-07-24T05:00:00.000Z"
    }];

    let plugins = [TimeGrid, Interaction];

    let options;
    let evcal;
    
    $: options = {
        events: events,
        view: "timeGridDay",
        allDaySlot: false,
        header: {
            start: "",
            center: "title",
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
</script>

<Calendar bind:this={evcal} {plugins} {options} />
