import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import puzzles from '$lib/data/puzzles';
import { populateRounds } from '$lib/utilsServer';
import { getRoundName } from "$lib/utils";
import { db } from '$lib/db';
import { jsonArrayFrom } from 'kysely/helpers/postgres';

export const load = (async ({ params }) => {
    const id = Number(params.id)

    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    const meetup = await db.selectFrom('meetup')
        .where('meetup.id', '=', id)
        .select((eb) => [
            'date',
            'name',
            'meetup.id',
            jsonArrayFrom(
                eb.selectFrom('round')
                    .leftJoin('result', 'round.id', 'result.round_id')
                    .select((eb) => [
                            'round.id',
                            'end_date',
                            'start_date',
                            'puzzle',
                            'format',
                            'proceed_number',
                            eb.fn.count('result.id').as('result_count')
                        ]
                    )
                    .orderBy('round.start_date asc')
                    .where('round.meetup_id', '=', id)
                    .groupBy(['round.id'])
            )
            .as('rounds')
        ])
        .groupBy(['meetup.date', 'meetup.name', 'meetup.id'])
        .executeTakeFirst()


    if (!meetup)
        throw error(404, 'not found')

    const maxRounds = populateRounds(meetup.rounds);

    const events = meetup.rounds.map(round => ({
        id: round.id,
        start: round.start_date,
        end: round.end_date,
        title: getRoundName(puzzles[round.puzzle].name, round.number, maxRounds[round.puzzle]),
        editable: round.result_count == 0, // Only editable if no results
        extendedProps: {
            puzzleType: round.puzzle,
            formatType: round.format,
            proceed_number: round.proceed_number,
            server: true,
        }
    }))

    return { meetup, events, maxRounds }
}) satisfies PageServerLoad

