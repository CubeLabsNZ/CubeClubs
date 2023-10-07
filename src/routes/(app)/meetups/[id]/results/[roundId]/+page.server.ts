import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import { populateRounds, getMeetupPuzzles } from "$lib/utilsServer";
import { db } from '$lib/db';
import { jsonArrayFrom } from 'kysely/helpers/postgres'


export const load = (async ({ params }) => {
    const id = Number(params.id)

    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    // TODO: infinity is returned as string from here :(
    const meetup = await db.selectFrom('meetup')
        .where('meetup.id', '=', id)
        .select((eb) => [
            // TODO: this should be a join?
            jsonArrayFrom(
                eb.selectFrom('round')
                    .select((eb) => [
                        'round.id', 'round.start_date', 'round.end_date', 'round.puzzle', 'round.format', 'round.proceed_number',
                        jsonArrayFrom(
                            // TODO: this should be a join?
                            eb.selectFrom('result')
                                .select((eb) => [
                                    'value',
                                    'user.id as user_id', 'user.name as user_name', 'user.region as user_region',
                                    'result.mbld_score', 'result.mbld_total',
                                    eb.fn.agg<string[]>('array_agg', ['solve.time']).as('solves')
                                ])
                                .orderBy(['result.mbld_score desc', 'value asc'])
                                .groupBy(['value', 'user.id', 'user.name', 'user.region', 'result.mbld_score', 'result.mbld_total'])
                                .innerJoin('user', 'user.id', 'result.user_id')
                                .leftJoin("solve", 'result.id', 'solve.result_id')
                                .whereRef('result.round_id', '=', 'round.id')
                        ).as('results')
                    ])
                    .where('round.meetup_id', '=', id)
            ).as('rounds'),
            'is_published'
        ])
        .groupBy(['meetup.is_published'])
        .executeTakeFirst()


    // TODO: check admin, can view "public page" in dashboard -> to here.
    if (!meetup || !meetup.is_published) {
        throw error(404, 'not found');
    }

    const puzzles = getMeetupPuzzles(meetup);
    const maxRounds = populateRounds(meetup.rounds)

    return {
        puzzles,
        rounds: meetup.rounds,
        maxRounds,
        meetupId: params.id,
        roundId: params.roundId
    }
})
