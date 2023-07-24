<script>
    import Calendar from "@event-calendar/core";
    import Interaction from "@event-calendar/interaction";
    import TimeGrid from "@event-calendar/time-grid";

    let plugins = [TimeGrid, Interaction];

    let start = new Date();
    start.setTime(1690123605);

    let end = new Date();
    end.setTime(1690130805);

    let options = {
        view: "timeGridDay",
        allDaySlot: false,
        events: [
            { id: 0, start: start, end: end, title: "event", edtiable: true, display: "auto" }
        ]
    }
</script>

<Calendar {plugins} {options} />

