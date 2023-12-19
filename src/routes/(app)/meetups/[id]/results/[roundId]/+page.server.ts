import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import { populateRounds, getMeetupPuzzles } from "$lib/utilsServer";
import { db } from '$lib/db';
import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { northIslandRegions, southIslandRegions } from '$lib/data/regions';
import { sql } from 'kysely'


export const load = (async ({ params }) => {
    const id = Number(params.id)
    const roundId = params.roundId

    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    // TODO: infinity is returned as string from here :(
    // TODO: why is this returning all rounds ? why is meetup barely used ?
    const round = await db.selectFrom('round')
        .innerJoin('meetup', 'meetup.id', 'round.meetup_id')
        // TODO: make this a reusable function
        .innerJoinLateral(eb => eb
            .selectFrom('round as round_inner')
            .select(eb => [
                eb.fn.count('round_inner.id').as('round_maximum'),
                eb(eb.fn.count('round_inner.id').filterWhereRef('round_inner.start_date', '<', 'round.start_date'), '+', eb.lit(1)).as('round_number')
            ])
            .whereRef('round_inner.meetup_id', '=', 'meetup.id')
            .whereRef('round_inner.puzzle', '=', 'round.puzzle')
            .as('counts'), join => join.onTrue())



        .select((eb) => [
            'round.id', 'round.start_date', 'round.end_date', 'round.puzzle', 'round.format', 'round.proceed_number', 'meetup.is_published', 'counts.round_maximum', 'counts.round_number',
            // TODO: this should be a join?
            jsonArrayFrom(
                eb.selectFrom('result')
                    .innerJoin('user', 'user.id', 'result.user_id')


                    // TODO: make these reusable
                    .leftJoinLateral(
                        (eb) => {
                            return eb.selectFrom('result as re2')
                                .innerJoin('user as user_inner', 'user_inner.id', 're2.user_id')
                                .innerJoin('round as round_inner', 'round_inner.id', 're2.round_id')
                                .select((eb) => [
                                    eb(eb.fn.count('re2.id'), '=', eb.lit(0)).as('is_icr'),
                                    eb(eb.fn.count('re2.id').filterWhereRef('user_inner.region', '=', 'user.region'), '=', eb.lit(0)).as('is_rr'),
                                    eb(eb.fn.count('re2.id').filterWhere(eb =>
                                        eb.or([
                                            eb.and([
                                                eb('user_inner.region', 'in', southIslandRegions),
                                                eb('user.region', 'in', southIslandRegions)
                                            ]),
                                            eb.and([
                                                eb('user_inner.region', 'in', northIslandRegions),
                                                eb('user.region', 'in', northIslandRegions)
                                            ])
                                        ])
                                    ), '=', eb.lit(0)).as('is_ir'),
                                ])
                                .whereRef('round_inner.end_date', '<=', 'round.end_date')
                                .whereRef('round_inner.puzzle', '=', 'round.puzzle')
                                .whereRef('re2.value', '<', 'result.value')
                                // TODO: OR mbld
                                .as('records_avg')
                        }
                        ,
                        join => (join.onTrue())
                    )
                    .leftJoinLateral(
                        (eb) => {
                            return eb.selectFrom('solve as s2')
                                .innerJoin('result as re2', 're2.id', 's2.result_id')
                                .innerJoin('user as user_inner', 'user_inner.id', 're2.user_id')
                                .innerJoin('round as round_inner', 'round_inner.id', 're2.round_id')
                                .innerJoin(eb => eb
                                    .selectFrom('solve as s3').select(eb => eb.fn.agg('min', 's3.time').as('best')).whereRef('s3.result_id', '=', 'result.id').as('best'),
                                    join => join.onTrue())
                                .select((eb) => [
                                    //eb.fn.min('s2.time').filterWhereRef('result.id', '=', 's2.result_id').as('b'),
                                    eb(eb.fn.countAll('s2'), '=', eb.lit(0)).as('is_icr'),
                                    eb(eb.fn.countAll('s2').filterWhereRef('user_inner.region', '=', 'user.region'), '=', eb.lit(0)).as('is_rr'),
                                    eb(eb.fn.countAll('s2').filterWhere(eb =>
                                        eb.or([
                                            eb.and([
                                                eb('user_inner.region', 'in', southIslandRegions),
                                                eb('user.region', 'in', southIslandRegions)
                                            ]),
                                            eb.and([
                                                eb('user_inner.region', 'in', northIslandRegions),
                                                eb('user.region', 'in', northIslandRegions)
                                            ])
                                        ])
                                    ), '=', eb.lit(0)).as('is_ir'),
                                ])
                                .whereRef('round_inner.end_date', '<=', 'round.end_date')
                                .whereRef('round_inner.puzzle', '=', 'round.puzzle')
                                .whereRef('s2.time', '<', 'best.best')
                                // TODO: OR mbld
                                .as('records_sng')
                        }
                        ,
                        join => (join.onTrue())
                    )


                    .select((eb) => [
                        'value',
                        'user.id as user_id', 'user.name as user_name', 'user.region as user_region',
                        'result.mbld_score', 'result.mbld_total',

                        'records_avg.is_icr as is_average_icr',
                        'records_avg.is_ir as is_average_ir',
                        'records_avg.is_rr as is_average_rr',

                        'records_sng.is_icr as is_single_icr',
                        //'records_sng.is_ir as is_single_ir',
                        'records_sng.is_rr as is_single_rr',
                        sql<string[]>`array_agg(solve.time ORDER BY solve.index ASC)`.as('solves')
                    ])
                    .orderBy(['result.mbld_score desc', 'value asc'])
                    .groupBy(['value', 'user.id', 'user.name', 'user.region', 'result.mbld_score', 'result.mbld_total', 'records_avg.is_icr',
                        'records_avg.is_ir',
                        'records_avg.is_rr',
                        'records_sng.is_icr',
                        'records_sng.is_ir',
                        'records_sng.is_rr',])
                    .leftJoin("solve", 'result.id', 'solve.result_id')
                    .whereRef('result.round_id', '=', 'round.id')
            ).as('results')
        ])
        .where('round.meetup_id', '=', id)
        .where('round.id', '=', roundId)
        .executeTakeFirst()


    // TODO: check admin, can view "public page" in dashboard -> to here.
    if (!round || !round.is_published) {
        throw error(404, 'not found');
    }

    return {
        round,
        meetupId: params.id,
        roundId: params.roundId
    }
})
