import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Puzzle } from '@prisma/client';

import puzzles from '$lib/data/puzzles'
import { islandRegions } from '$lib/data/regions';
import { DNF } from '$lib/utils';
import { db } from '$lib/db';
import { sql } from 'kysely';

export const load = (async ({ params }) => {

    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    const user = await prisma.user.findUnique({
        where: {
            id: Number(params.id),
        },
        select: {
            name: true,
            id: true,
            region: true,
            is_club_organiser: true,
            _count: {
                select: {
                    competing_in: {
                        where: {
                            meetup: {
                                date: {
                                    lt: new Date()
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    if (!user) {
        throw error(404, 'not found');
    }
    
    // TODO: why is everything awaited immediately? it should all go to promise and await and the end.

    //const completedSolves = user.results.reduce((x, y) => x + y.solves.length, 0)
    const solvesQuery = await db.selectFrom('solve')
        .select(({fn}) => [fn.countAll().as('completedSolves')])
        .innerJoin('result', 'result.id', 'solve.result_id')
        .where('result.user_id', '=', user.id)
        .where('solve.time', '!=', Infinity)
        .executeTakeFirst()

    const completedSolves = solvesQuery?.completedSolves ?? 0


    // TODO: try make this an array right away
    const medalsTemp = await db.with('last_rounds', (eb) =>
        eb.selectFrom('round')
            .select(['id', 'end_date'])
            .distinctOn(['puzzle', 'meetup_id'])
            .orderBy(['puzzle', 'meetup_id', 'end_date desc'])
    )
        .selectFrom('last_rounds')
        .select((eb) => [
            eb.fn.count('result.id').filterWhere('rank', '=', '1').as('gold'),
            eb.fn.count('result.id').filterWhere('rank', '=', '2').as('silver'),
            eb.fn.count('result.id').filterWhere('rank', '=', '3').as('bronze')
        ])
        .innerJoinLateral(
            (eb) => eb.selectFrom('result')
                .select((fb) => [
                    'result.id as id', 'value', 'user.id as user_id',
                    fb.fn.agg<number>('row_number').over(ob => ob.orderBy('result.value', 'asc')).as('rank')
                ])
                .innerJoin('user', 'user.id', 'result.user_id')
                .whereRef('result.round_id', '=', 'last_rounds.id')
                .orderBy('result.value asc')
                .limit(3)
                .as('result'),
            (join) => join.onTrue()
        )
        .where('user_id', '=', user.id)
        .where('value', '!=', Infinity)
        .executeTakeFirst()


    const medals = [medalsTemp.gold, medalsTemp.silver, medalsTemp.bronze]



    // TODO: figure out a way to get PRs with groupBy and min or discrete or smth
    //
    type PRInfo = {
        time: number,
        RR: number,
        IR: number,
        IcR: number
    }

    type RInfo = {
        single: number,
        average: number
    }

    const records: { regional: RInfo, island: RInfo, interclub: RInfo } = {
        regional: { single: 0, average: 0 },
        island: { single: 0, average: 0 },
        interclub: { single: 0, average: 0 }
    }

    const PRs: { [key in Puzzle]: { single: PRInfo, average: PRInfo } } = {}

    for (const [key, puzzle] of Object.entries(puzzles)) {
        // TODO: plusTwo - consult - maybe DNF = inf
        const single = await prisma.solve.findFirst({
            where: {
                result: {
                    user_id: user.id,
                    round: {
                        puzzle: key
                    }
                },
            },
            orderBy: {
                time: 'asc'
            }
        })

        if (!single) continue;

        const average = await prisma.result.findFirst({
            where: {
                user_id: user.id,
                round: {
                    puzzle: key
                }
            },
            orderBy: {
                value: 'asc'
            }
        })

        if (!average) continue; // Should never happen

        // PERSONAL RECORDS / RANKINGS

        const countSingleBaseQuery = db.selectFrom('solve')
            .innerJoin('result', 'result.id', 'solve.result_id')
            .innerJoin('round', 'round.id', 'result.round_id')
            .innerJoin('user', 'user.id', 'result.user_id')
            .where('time', '<', single.time)
            .where('round.puzzle', '=', key)
            .select(({ fn }) => [fn.count<number>('result.user_id').distinct().as("count")])

        const countRRSingle = Number((await countSingleBaseQuery.where('user.region', '=', user.region).executeTakeFirst())?.count)
        const countIRSingle = Number((await countSingleBaseQuery.where('user.region', 'in', islandRegions(user.region)).executeTakeFirst())?.count)
        const countIcRSingle = Number((await countSingleBaseQuery.executeTakeFirst())?.count)

        const countAverageBaseQuery = db.selectFrom('result')
            .innerJoin('round', 'round.id', 'result.round_id')
            .innerJoin('user', 'user.id', 'result.user_id')
            .where('value', '<', average.value)
            .where('round.puzzle', '=', key)
            .select(({ fn }) => [fn.count('result.user_id').distinct().as("count")])

        const countRRAverage = Number((await countAverageBaseQuery.where('user.region', '=', user.region).executeTakeFirst())?.count)
        const countIRAverage = Number((await countAverageBaseQuery.where('user.region', 'in', islandRegions(user.region)).executeTakeFirst())?.count)
        const countIcRAverage = Number((await countAverageBaseQuery.executeTakeFirst())?.count)

        PRs[key] = {
            single: {
                time: single.time,
                RR: countRRSingle + 1,
                IR: countIRSingle + 1,
                IcR: countIcRSingle + 1,
            }, average: {
                time: average.value,
                RR: countRRAverage + 1,
                IR: countIRAverage + 1,
                IcR: countIcRAverage + 1
            }
        }

        // NUMBER OF RECORDS


        // TODO: can this be 1 query?
        const getNumRecordsSingle = async (regionPredicate: any) => Number((await db.with('all_records', (eb) => (
            eb.selectFrom('solve')
                .innerJoin('result', 'result.id', 'solve.result_id')
                .innerJoin('round', 'round.id', 'result.round_id')
                .innerJoin('user', 'user.id', 'result.user_id')
                .where('round.puzzle', '=', key)
                .where(...regionPredicate)
                .select(({ fn }) => [fn.min('time').over(ob => ob.orderBy('round.end_date', 'asc')).as('cum_min'), 'user.id as user_id'])
                .distinctOn('cum_min')
                // Must order by time so distinct on picks correct value
                .orderBy(['cum_min asc', 'time asc'])
        ))
            .selectFrom('all_records')
            .where('all_records.user_id', '=', user.id)
            .select(({ fn }) => [fn.count('all_records.cum_min').as("count")])
            .executeTakeFirstOrThrow()).count)

        records.regional.single += await getNumRecordsSingle(['user.region', '=', user.region])
        records.island.single += await getNumRecordsSingle(['user.region', 'in', islandRegions(user.region)])
        records.interclub.single += await getNumRecordsSingle([true])



        const getNumRecordsAverage = async (regionPredicate: any) => Number((await db.with('all_records', (eb) => (
            eb.selectFrom('result')
                .innerJoin('round', 'round.id', 'result.round_id')
                .innerJoin('user', 'user.id', 'result.user_id')
                .where('round.puzzle', '=', key)
                .where(...regionPredicate)
                .select(({ fn }) => [fn.min('value').over(ob => ob.orderBy('round.end_date', 'asc')).as('cum_min'), 'user.id as user_id'])
                .distinctOn('cum_min')
                // Must order by time so distinct on picks correct value
                .orderBy(['cum_min asc', 'value asc'])
        ))
            .selectFrom('all_records')
            .where('all_records.user_id', '=', user.id)
            .select(({ fn }) => [fn.count('all_records.cum_min').as("count")])
            .executeTakeFirstOrThrow()).count)

        records.regional.average += await getNumRecordsAverage(['user.region', '=', user.region])
        records.island.average += await getNumRecordsAverage(['user.region', 'in', islandRegions(user.region)])
        records.interclub.average += await getNumRecordsAverage([true])

    }

    let results = await db.with('temp', (eb) => eb.selectFrom('result')
        .innerJoin('round', 'round.id', 'result.round_id')
        .innerJoin('meetup', 'meetup.id', 'round.meetup_id')
        .leftJoin("solve", 'result.id', 'solve.result_id')
        .select(({ fn, selectFrom }) => [
            'meetup.name as meetup_name',
            'meetup.id as meetup_id',
            'round.puzzle as puzzle',
            'round.id as round_id',
            'result.value as value',
            'round.end_date as round_end',
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
                .limit(1),
            selectFrom('round as round_inner')
                .innerJoin('result as result_inner', 'result_inner.round_id', 'round_inner.id')
                .whereRef('round_inner.id', '=', 'round.id')
                .whereRef('result_inner.value', '<', 'result.value')
                .select((eb2) => [eb2.fn.countAll().as('better_result_cnt')])
                .limit(1)
                .as('rank'),
            fn.min('solve.time').as('single'),
            fn.agg<string[]>('array_agg', ['solve.time']).as('solves'),
        ])
        .groupBy(['round.puzzle', 'result.value', 'meetup_name', 'meetup.id', 'round.id'])
        .orderBy('round_end desc')
        .where('result.user_id', '=', user.id)
    )
        .selectFrom('temp')
        .groupBy('puzzle')
        // TODO try this better
        .select(({ fn }) => ['puzzle',
            sql<any>`json_agg(temp) as values`
        ])
        .execute()

    // TODO: figure out how to sort in the query
    results.sort((a, z) => z.round_end - a.round_end)
    results = Object.fromEntries(results.map(x => [x.puzzle, x.values]))

    return {
        user,
        completedSolves,
        medals,
        results,
        PRs,
        records
    }
}) satisfies PageServerLoad
