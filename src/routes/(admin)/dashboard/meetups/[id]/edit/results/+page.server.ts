import prisma from '$lib/prisma';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserSessionOrThrow, populateRounds } from '$lib/utilsServer';
import { calculateAverage, calulateMbldAverage } from "$lib/utils";
import type { Format, Prisma } from "@prisma/client";
import formats from '$lib/data/formats';
import { db } from '$lib/db';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { sql } from 'kysely';

export const load = (async ({ url, params, cookies }) => {
    // FIXME: broken ? await getUserSessionOrThrow(cookies, true)

    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found');
    }


    // TODO: find some better way, maybe use TO_ARRAY or ARRAY_AGG instead of json
    let meetupQuery = db.selectFrom('meetup')
        .where('meetup.id', '=', id)
        .select(({ fn, selectFrom }) => [
            'id', 'name',
            jsonArrayFrom(selectFrom('round')
                .leftJoin(
                    selectFrom('result')
                        .innerJoin('solve', 'solve.result_id', 'result.id')
                        .innerJoin('user', 'user.id', 'result.user_id')
                        .select(
                            (eb) => [
                                'result.id',
                                'value',
                                'result.mbld_score',
                                'result.mbld_total',
                                'round_id',
                                'user.id as user_id',
                                'user.name as user_name',
                                fn.agg('array_agg', 'solve').as('solves')
                            ]
                        )
                        .groupBy(['result.id', 'user.name', 'user.id'])
                        .orderBy(['result.mbld_score desc'])
                        .as('result'),
                    'round.id', 'result.round_id')
                .select(({ selectFrom, fn, selectNoFrom }) => {
                    return [
                        'round.id',
                        'format',
                        'puzzle',
                        fn.agg('row_number').over((ov) => ov.partitionBy('puzzle').orderBy('round.end_date asc')).as('number'),
                        //fn.agg('lag', jsonArrayFrom(r.select(['user.id', 'value']).orderBy('value asc').limit(10)), 1).over((ov) => ov.partitionBy('puzzle').orderBy('round.end_date asc')).as('prev_round_results'),
                        fn.count('round.id').filterWhereRef('puzzle', '=', 'round.puzzle').as('round_maximum'),
                        jsonArrayFrom(selectFrom('user')
                            .innerJoin('user_in_meetup', 'user_in_meetup.user_id', 'user.id')
                            .select(['round.id', 'name as user_name', 'user.id as user_id'])
                            .whereRef('user_in_meetup.meetup_id', '=', 'meetup.id')
                            .where((eb) => eb('round.puzzle', '=', eb.fn('any', eb.ref('user_in_meetup.registered_events'))))
                        ).as('users'),
                        //fn.agg('array_agg', 'result').as('results')
                        sql<{}[]>`array_agg(result ORDER BY mbld_score DESC, value ASC)`.as('results')
                    ]
                }
                )
                .groupBy('round.id')
                .orderBy('round.start_date asc')
                .where('round.meetup_id', '=', id)
            ).as('rounds')
        ])


    /*
        selectFrom('round as round_inner')
            .whereRef('round_inner.puzzle', '=', 'round.puzzle')
            .whereRef('round_inner.meetup_id', '=', 'round.meetup_id')
            .whereRef('round_inner.start_date', '<', 'round.start_date')
            // Cant figure out coalesce, it makes things :(
            .select([sql`COALESCE(COUNT(*),0) AS round_number`])
            .limit(1),
        // TODO: merge with above select and do FILTER WHERE
        selectFrom('round as round_inner')
            .whereRef('round_inner.puzzle', '=', 'round.puzzle')
            .whereRef('round_inner.meetup_id', '=', 'round.meetup_id')
            // Cant figure out coalesce, it makes things :(
            .select([sql`COALESCE(COUNT(*),0) AS round_maximum`])
            .limit(1), */
    const meetup = await meetupQuery.executeTakeFirst()

    if (!meetup) {
        throw error(404, 'not found');
    }

    const prevRoundForPuzzle: any = {}
    for (const round of meetup.rounds) {
        if (prevRoundForPuzzle[round.puzzle] == undefined) {
            prevRoundForPuzzle[round.puzzle] = round
            continue;
        }
        const prevRound = prevRoundForPuzzle[round.puzzle]
        round.users = prevRound.results.filter((x) => x != Infinity).toSorted((a, z) => (a.value - z.value)).slice(0, prevRound.proceed_number)
        prevRoundForPuzzle[round.puzzle] = round
    }

    // TODO: live resuts needs round
    return {
        meetup,
    }
}) satisfies PageServerLoad

export const actions = {
    // NOTE: You can update any meetup with this endpoint but it doesnt really matter since only events for the correct meetup will show up in the form

    default: async ({ cookies, request, params }) => {
        await getUserSessionOrThrow(cookies, true)
        const data = await request.formData()

        const eventId = data.get("event")
        const competitorId = Number(data.get("competitor"))

        console.log(eventId, competitorId)
        if (!eventId || !competitorId || typeof eventId != "string") {
            throw error(400, 'Event/Competitor not provided or invalid')
        }

        const id = Number(params.id)
        if (isNaN(id)) {
            throw error(404, 'not found');
        }

        const round = await db.selectFrom('round')
            .select(['puzzle', 'format'])
            .where('meetup_id', '=', id)
            .where('id', '=', eventId)
            .executeTakeFirst()

        if (!round) {
            throw error(404, 'not found')
        }

        const solves = Array.from(Array(formats[round.format].count).keys()).map((x) => Number(data.get(`solve-${x}`)))

        if (isNaN(competitorId) || solves.includes(NaN)) {
            throw error(400, { event: eventId, competitor: competitorId })
        }


        await db.transaction().execute(async(db) => {
            // TODO: make this compound ID later on
            db.deleteFrom('result')            
                .where('round_id', '=', eventId)
                .where('user_id', '=', competitorId)
                .execute()

            let mbld_score
            let mbld_total
            let value


            if (round.puzzle == "MULTIBLD") {
                const mbld_data = [...Array(formats[round.format].count)].map((_, i) => {
                    const successes = Number(data.get(`successes-${i}`) ?? undefined)
                    const attempts = Number(data.get(`attempts-${i}`) ?? undefined)
                    if (isNaN(successes) || isNaN(attempts)) {
                        throw error(400)
                    }
                    const failures = attempts - successes
                    const score = successes - failures
                    return {
                        time: solves[i],
                        score: score,
                        total_attempts: attempts
                    }
                })
                const res = calulateMbldAverage(round.format, mbld_data)
                value = res!.time
                mbld_score = res!.score
                mbld_total = res!.total_attempts
            } else {
                value = calculateAverage(round.format, solves)
            }


            // TODO: make 1 query: https://stackoverflow.com/a/73723905
            const newResult = await db.insertInto('result')
                .values({
                    user_id: competitorId,
                    round_id: eventId,
                    mbld_score,
                    mbld_total,
                    value
                })
                .returning(['id'])
                .executeTakeFirstOrThrow()

            await db.insertInto('solve')
                .values(solves.map((time, idx) => ({ index: idx, time: time, result_id: newResult.id })))
                .execute()
        })


        return { event: eventId }
    }
} satisfies Actions
