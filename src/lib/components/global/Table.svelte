

<style>
    tr:nth-child(2) td {
        border-top: solid 8px white;
    }

    tr:last-child td {
        border-bottom: solid 8px white;
    }

    td:first-child, th:first-child {
        border-left: solid 6px white;
    }

    td:last-child, th:last-child {
        border-right: solid 6px white;
    }

    td, th {
        padding-top: 5px;
        padding-bottom: 4px;
    }

    .tc-name, .tc-region, .tc-solves {
        text-align: left;
    }

    .tc-name {
        min-width: 200px;
    }

    .tc-average, .tc-name {
        font-weight: 500;
    }

    tr:not(:first-child) .tc-name {
        color: var(--c-a);
    }

    .tc-average, .tc-best, .tc-ranking {
        text-align: right;
    }

    .tc-ranking {
        color: var(--c-dg1);
    }

    .tc-ranking[data-proceed=true] {
        color: var(--c-green);
        font-weight: 600;
    }
</style>
