import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import puzzles from '$lib/data/puzzles';
import { populateRounds } from '$lib/utilsServer';

export const load = (async ({ cookies, params }) => {
    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    const meetup = await prisma.meetup.findUnique({
        where: { id: Number(params.id) },
        select: {
            date: true,
            rounds: {
                select: {
                    endDate: true,
                    startDate: true,
                    puzzle: true,
                    _count: true
                }
            }
        ,
        }
    })

    if (!meetup) {
        throw error(404, 'not found')
    }

    console.log(meetup.rounds)

    populateRounds(meetup.rounds)

    const events = meetup.rounds.map(round => ({
        id: crypto.randomUUID(),
        start: round.startDate,
        end: round.endDate,
        // TODO: deduplicate this - it's in the client too
        title: `${puzzles[round.puzzle].name} - Round ${round.number}`,
        enditable: round._count.results == 0, // Only editable if no results
        extendedProps: {
            puzzleType: round.puzzle,
            server: true,
        }
    }))

    return { meetup, events }
}) satisfies PageServerLoad

