import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import puzzles from '$lib/data/puzzles';
import { populateRounds } from '$lib/utilsServer';
import { getRoundName } from "$lib/utils";

export const load = (async ({ params }) => {
    const id = Number(params.id)

    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    const meetup = await prisma.meetup.findUnique({
        where: { id: Number(params.id) },
        select: {
            date: true,
            name: true,
            id: true,
            rounds: {
                select: {
                    id: true,
                    end_date: true,
                    start_date: true,
                    puzzle: true,
                    format: true,
                    proceed_number: true,
                    _count: true
                },
                orderBy: {
                    // TODO: check consistency.
                    // Just dont have overlapping rounds please.
                    start_date: "asc"
                }
            }
        ,
        }
    })

    if (!meetup)
        throw error(404, 'not found')

    const maxRounds = populateRounds(meetup.rounds);

    const events = meetup.rounds.map(round => ({
        id: round.id,
        start: round.start_date,
        end: round.end_date,
        title: getRoundName(puzzles[round.puzzle].name, round.number, maxRounds[round.puzzle]),
        editable: round._count.results == 0, // Only editable if no results
        extendedProps: {
            puzzleType: round.puzzle,
            formatType: round.format,
            proceed_number: round.proceed_number,
            server: true,
        }
    }))

    return { meetup, events, maxRounds }
}) satisfies PageServerLoad

