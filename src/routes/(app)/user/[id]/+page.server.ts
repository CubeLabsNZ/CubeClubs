import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Puzzle } from '@prisma/client';

import puzzles from '$lib/data/puzzles'
import { islandRegions } from '$lib/data/regions';
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


    const userIslandRegions = islandRegions(user.region)


    // Don't even talk to me right now.
    const getHistoricalRecords = async () => {
        const recordsHistory = {}

        const historicalAverages = await db.with('ungrouped', eb =>
            eb.selectFrom('result')
                .distinctOn('cum_min')
                .innerJoin('round', 'round.id', 'result.round_id')
                .innerJoin('meetup', 'meetup.id', 'round.meetup_id')
                .innerJoin('user', 'user.id', 'result.user_id')
                .leftJoin("solve", 'result.id', 'solve.result_id')
                .where('user.id', '=', user.id)
                .select(({ fn, selectFrom }) => [
                    fn.min('result.value').over(ob => ob.orderBy('round.end_date', 'asc').partitionBy(['round.puzzle'])).as('cum_min'),
                    'meetup.id as meetup_id',
                    'meetup.name as meetup_name',
                    'round.end_date as date',
                    selectFrom('round as round_inner')
                        .whereRef('round_inner.puzzle', '=', 'round.puzzle')
                        .whereRef('round_inner.meetup_id', '=', 'meetup.id')
                        .whereRef('round_inner.start_date', '<', 'round.start_date')
                        .select((eb) => [eb.fn.coalesce(eb.fn.count('id'), eb.lit(0)).as('round_number')])
                        .limit(1).as('round_number'),
                    // TODO: merge with above select and do FILTER WHERE or OVER WHERE
                    selectFrom('round as round_inner')
                        .whereRef('round_inner.puzzle', '=', 'round.puzzle')
                        .whereRef('round_inner.meetup_id', '=', 'meetup.id')
                        .select((eb) => [eb.fn.coalesce(eb.fn.count('id'), eb.lit(0)).as('round_maximum')])
                        .limit(1).as('round_maximum'),
                    // TODO: check order
                    fn.agg<string[]>('array_agg', ['solve.time']).as('solves'),

                    'round.puzzle',
                ])
                .groupBy(['result.value', 'user.name', 'user.id', 'round.puzzle', 'round.end_date', 'meetup.id', 'round.start_date'])
                // Must order by time so distinct on picks correct value
                .orderBy(['cum_min asc', 'value asc'])
        )
            .selectFrom('ungrouped')
            .select((eb) => [
                eb.fn('json_build_object', ['puzzle', eb.fn('json_agg', 'ungrouped')]).as('obj')
            ])
            .groupBy('ungrouped.puzzle')
            .execute()

        const historicalSingles = await db.with('ungrouped', eb =>
            eb.selectFrom('solve')
                .distinctOn('cum_min')
                .innerJoin('result', 'result.id', 'solve.result_id')
                .innerJoin('round', 'round.id', 'result.round_id')
                .innerJoin('user', 'user.id', 'result.user_id')
                .innerJoin('meetup', 'meetup.id', 'round.meetup_id')
                .where('user.id', '=', user.id)
                .select(({ fn }) => [
                    fn.min('solve.time').over(ob => ob.orderBy('round.end_date', 'asc').partitionBy(['round.puzzle'])).as('cum_min'),
                    'meetup.id as meetup_id',
                    'meetup.name as meetup_name',
                    'round.end_date as date',
                    // TODO: check order

                    'round.puzzle',
                    'solve.time'

                ])
                .groupBy(['solve.time', 'user.name', 'user.id', 'round.puzzle', 'round.end_date', 'meetup.id'])
                .orderBy(['cum_min asc', 'time asc'])
        )
            .selectFrom('ungrouped')
            .select((eb) => [
                eb.fn('json_build_object', ['puzzle', eb.fn('json_agg', 'ungrouped')]).as('obj')
            ])
            .groupBy('ungrouped.puzzle')
            .execute()


        const toEntries = (x) => {
            const puzzle = Object.keys(x.obj)[0]
            return [puzzle, x.obj[puzzle]]
        }

        const historicalRecords = Object.fromEntries(historicalSingles.map(toEntries))

        for (const x of historicalAverages) {
            const puzzle = Object.keys(x.obj)[0]
            historicalRecords[puzzle] = (historicalRecords[puzzle] ?? []).concat(x.obj[puzzle])
        }

        return historicalRecords
    }

    const historicalRecords = getHistoricalRecords()


    //const completedSolves = user.results.reduce((x, y) => x + y.solves.length, 0)
    const solvesQuery = db.selectFrom('solve')
        .select(({ fn }) => [fn.countAll().as('completedSolves')])
        .innerJoin('result', 'result.id', 'solve.result_id')
        .where('result.user_id', '=', user.id)
        .where('solve.time', '!=', Infinity)
        .executeTakeFirst()



    // TODO: try make this an array right away
    const medals = (async () => {
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
        return [medalsTemp.gold, medalsTemp.silver, medalsTemp.bronze]
    })()




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

    // TODO: partition by puzzle instead of foreach, or at least subquery
    for (const [key, puzzle] of Object.entries(puzzles)) {

        const average = await db.selectFrom('result')
            .selectAll()
            .innerJoin('round', 'result.round_id', 'round.id')
            .where('result.user_id', '=', user.id)
            .where('round.puzzle', '=', key)
            .orderBy('value asc')
            .executeTakeFirst()

        if (!average) continue; // Should never happen

        // PERSONAL RECORDS / RANKINGS

        const countSingle = await db.selectFrom('solve')
            .innerJoin('result', 'result.id', 'solve.result_id')
            .innerJoin('round', 'round.id', 'result.round_id')
            .innerJoin('user', 'user.id', 'result.user_id')
            .innerJoinLateral(eb => eb.selectFrom('solve as best_solve').selectAll().innerJoin('result as re2', 'best_solve.result_id', 're2.id').innerJoin('round as ro2', 're2.round_id', 'ro2.id').where('ro2.puzzle', '=', key).where('re2.user_id', '=', user.id).orderBy(['best_solve.mbld_score desc', 'best_solve.time asc']).limit(1).as('best_solve'), join => join.onTrue())
            .whereRef('solve.time', '<=', 'best_solve.time')
            .where('round.puzzle', '=', key)
            .select((eb) => [
                eb.fn.count<number>('result.user_id').distinct().as("IcR"),
                eb.fn.count<number>('result.user_id').filterWhere('user.region', '=', user.region).distinct().as("RR"),
                eb.fn.count<number>('result.user_id').filterWhere('user.region', 'in', userIslandRegions).distinct().as("IR"),
                'best_solve.time as time'
            ])
            .groupBy('best_solve.time')
            .executeTakeFirst()

        const countAverage = await db.selectFrom('result')
            .innerJoin('round', 'round.id', 'result.round_id')
            .innerJoin('user', 'user.id', 'result.user_id')
            .innerJoinLateral(eb => eb.selectFrom('result as best_result').selectAll().innerJoin('round as ro2', 'best_result.round_id', 'ro2.id').where('ro2.puzzle', '=', key).where('best_result.user_id', '=', user.id).orderBy(['best_result.mbld_score desc', 'best_result.value asc']).limit(1).as('best_result'), join => join.onTrue())
            .whereRef('result.value', '<=', 'best_result.value')
            .where('round.puzzle', '=', key)
            .select((eb) => [
                eb.fn.count<number>('result.user_id').distinct().as("IcR"),
                eb.fn.count<number>('result.user_id').filterWhere('user.region', '=', user.region).distinct().as("RR"),
                eb.fn.count<number>('result.user_id').filterWhere('user.region', 'in', userIslandRegions).distinct().as("IR"),
                'best_result.value as time'
            ])
            .groupBy('best_result.value')
            .executeTakeFirst()

        PRs[key] = {
            single: countSingle, average: countAverage
        }

        // NUMBER OF RECORDS


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

    // WITh allresults select value, region
    let results = await db.with(
        'temp',
        (eb) => eb.selectFrom('result')
            .innerJoin('round', 'round.id', 'result.round_id')
            .innerJoin('meetup', 'meetup.id', 'round.meetup_id')
            .leftJoin("solve", 'result.id', 'solve.result_id')
            /*
            .leftJoinLateral(
                (eb) => eb.selectFrom('result as prev_results')
                    .innerJoin('user as user_inner', 'user_inner.id', 'result.user_id')
                    .innerJoin('round as round_inner', 'round_inner.id', 'result.round_id')
                    .select(['prev_results.id', 'value', 'user_inner.region', 'round_inner.puzzle', 'round_inner.end_date as date'])
                    .whereRef('round_inner.end_date', '<=', 'round.end_date')
                    .whereRef('round_inner.puzzle', '=', 'round.puzzle')
                    .whereRef('prev_results.value', '<', 'result.value')
                    .as('prev_results')
                    ,
                join => (join.onTrue())
            )
            */
            .select((eb) => {
                const subq_avg = eb.selectFrom('result as result_inner')
                    .innerJoin('user as user_inner', 'user_inner.id', 'result_inner.user_id')
                    .innerJoin('round as round_inner', 'round_inner.id', 'result_inner.round_id')
                    .whereRef('round_inner.puzzle', '=', 'round.puzzle')
                    .whereRef('round_inner.end_date', '<=', 'round.end_date')
                    .whereRef('result_inner.value', '<', 'result.value')
                    .select((eb) => [eb.fn.countAll()])

                const subq_single = eb.selectFrom('solve as solve_inner')
                    .innerJoin('result as result_inner', 'result_inner.id', 'solve_inner.result_id')
                    .innerJoin('user as user_inner', 'user_inner.id', 'result_inner.user_id')
                    .innerJoin('round as round_inner', 'round_inner.id', 'result_inner.round_id')
                    .whereRef('round_inner.puzzle', '=', 'round.puzzle')
                    .whereRef('round_inner.end_date', '<=', 'round.end_date')
                    .whereRef('solve_inner.time', '<', eb.fn.min('solve.time'))
                    .select((eb) => [eb.fn.countAll()])

                const is0 = (x) => (eb(x, '=', eb.lit(0)))
                return [
                    'meetup.name as meetup_name',
                    'meetup.id as meetup_id',
                    'round.puzzle as puzzle',
                    'round.id as round_id',
                    'result.value as value',
                    'round.end_date as round_end',



                    is0(subq_avg)
                        .as('is_average_icr'),

                    is0(subq_avg.where('user_inner.region', '=', user.region))
                        .as('is_average_rr'),

                    is0(subq_avg.where('user_inner.region', 'in', islandRegions(user.region)))
                        .as('is_average_ir'),


                    is0(subq_single)
                        .as('is_single_icr'),

                    is0(subq_single.where('user_inner.region', '=', user.region))
                        .as('is_single_rr'),

                    is0(subq_single.where('user_inner.region', 'in', islandRegions(user.region)))
                        .as('is_single_ir'),



                    // TODO: make these window functions
                    eb.selectFrom('round as round_inner')
                        .whereRef('round_inner.puzzle', '=', 'round.puzzle')
                        .whereRef('round_inner.meetup_id', '=', 'round.meetup_id')
                        .whereRef('round_inner.start_date', '<', 'round.start_date')
                        .select((eb) => [eb.fn.coalesce(eb.fn.count('id'), eb.lit(0)).as('round_number')])
                        .limit(1).as('round_number'),
                    // TODO: merge with above select and do FILTER WHERE
                    eb.selectFrom('round as round_inner')
                        .whereRef('round_inner.puzzle', '=', 'round.puzzle')
                        .whereRef('round_inner.meetup_id', '=', 'round.meetup_id')
                        .select((eb) => [eb.fn.coalesce(eb.fn.count('id'), eb.lit(0)).as('round_maximum')])
                        .limit(1).as('round_maximum'),
                    eb.selectFrom('round as round_inner')
                        .innerJoin('result as result_inner', 'result_inner.round_id', 'round_inner.id')
                        .whereRef('round_inner.id', '=', 'round.id')
                        .whereRef('result_inner.value', '<', 'result.value')
                        .select((eb2) => [eb2.fn.countAll().as('better_result_cnt')])
                        .limit(1)
                        .as('rank'),



                    //eb(eb.selectFrom('all_results').select(eb => eb.fn.count('id')).whereRef('all_results.puzzle', '=', 'round.puzzle').whereRef('all_results.value', '<', 'result.value').whereRef('all_results.date', '<', 'round.end_date').limit(1), '=', 0).as('icr'),

                    // all_results.puzzle has to be in group by which makes things explode
                    //eb.fn.min<number>('prev_results.value').over(ob => ob.partitionBy('round.puzzle').orderBy('round.end_date asc')).as('foo'),
                    //eb(eb.fn.count('prev_results.id').filterWhere('prev_results.region', '=', user.region), '=', 0).as('is_average_rr'),
                    //eb(eb.fn.count('prev_results.id'), '=', 0).as('is_average_icr'),

                    eb(eb.fn.min<number>(eb.fn.min('solve.time')).over(ob => ob.partitionBy('round.puzzle').orderBy('round.end_date asc')), '=', eb.fn.min('solve.time')).as('is_single_pr'),
                    eb(eb.fn.min<number>('result.value').over(ob => ob.partitionBy('round.puzzle').orderBy('round.end_date asc')), '=', eb.ref('result.value')).as('is_average_pr'),

                    eb.fn.min('solve.time').as('single'),
                    eb.fn.agg<string[]>('array_agg', ['solve.time']).as('solves'),

                    //eb.fn.agg('row_number').over(ob => ob.partitionBy('result.id')).as('foo')
                ]
            })
            .groupBy(['round.puzzle', 'result.value', 'meetup_name', 'meetup.id', 'round.id', 'result.id'])
            .where('result.user_id', '=', user.id)
    )
        .selectFrom('temp')
        .groupBy(['puzzle'])
        // TODO try this better
        .select((eb) => ['puzzle',
            sql<any>`json_agg(temp ORDER BY round_end DESC) as values`
        ])
        .execute()

    // TODO: figure out how to sort in the query
    //results.sort((a, z) => z.round_end - a.round_end)
    results = Object.fromEntries(results.map(x => [x.puzzle, x.values]))



    const completedSolves = (await solvesQuery)?.completedSolves ?? 0


    return {
        user,
        streamed: {
            medals,
            completedSolves
        },
        results,
        PRs,
        records,
        historicalRecords: await historicalRecords
    }
}) satisfies PageServerLoad
