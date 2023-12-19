import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

import puzzles from '$lib/data/puzzles'
import { db } from '$lib/db';
import { sql } from 'kysely';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url }) => {
    const filterRegion = url.searchParams.has("region") ? url.searchParams.get("region") : undefined;
    const displayType = url.searchParams.get("displayType");
    
    if (!displayType) {
        redirect(303, '?displayType=current');
    }

    const isDisplayCurrent = displayType == "current"


    const hasFilterRegion = !(filterRegion === undefined || filterRegion === null || filterRegion === "undefined")

    const records = async () => {
        const records = {}
        // TODO: subquery and group by
        for (const [key, puzzle] of Object.entries(puzzles)) {
            let singleQuery = db.selectFrom('solve')
                .innerJoin('result', 'result.id', 'solve.result_id')
                .innerJoin('round', 'round.id', 'result.round_id')
                .innerJoin('user', 'user.id', 'result.user_id')
                .innerJoin('meetup', 'meetup.id', 'round.meetup_id')
                .select((eb) => [
                    'time',
                    'user.id as user_id',
                    'user.name as user_name',
                    'user.region as user_region',
                    'meetup.id as meetup_id',
                    'meetup.name as meetup_name'
                ])
                .where('round.puzzle', '=', key)
                .orderBy('time asc')
                .where('solve.time', '!=', Infinity)


            if (hasFilterRegion) {
                singleQuery = singleQuery
                    .where('user.region', '=', filterRegion)
            }


            const single = await singleQuery.executeTakeFirst()

            if (!single) continue;

            let averageQuery = db.selectFrom('result')
                .innerJoin('round', 'round.id', 'result.round_id')
                .innerJoin('user', 'user.id', 'result.user_id')
                .innerJoin('meetup', 'meetup.id', 'round.meetup_id')
                .leftJoin("solve", 'result.id', 'solve.result_id')
                .select((eb) => [
                    'result.value',
                    'user.id as user_id',
                    'user.name as user_name',
                    'user.region as user_region',
                    'meetup.id as meetup_id',
                    'meetup.name as meetup_name',
                    'result.mbld_score',
                    'result.mbld_total',
                    // TODO: check order
                    eb.fn.agg<number[]>('array_agg', ['solve.time']).as('solves')
                ])
                .where('round.puzzle', '=', key)
                .where('result.value', '!=', Infinity)
                .groupBy(['result.value', 'user.id', 'user.name', 'user.region', 'meetup.id', 'meetup.name', 'result.mbld_score', 'result.mbld_total'])
                .orderBy(['result.mbld_score desc', 'value asc'])

            if (hasFilterRegion) {
                averageQuery = averageQuery
                    .where('user.region', '=', filterRegion)
            }

            const average = await averageQuery.executeTakeFirst()

            if (!average) continue; // Should never happen

            records[key] = {
                single: single,
                average: average
            }
        }
        return records
    }


    const historicalRecords = async () => {
        const recordsHistory = {}

        const historicalAverages = await db.with('ungrouped', eb =>
            eb.selectFrom('result')
                .distinctOn('cum_min')
                .innerJoin('round', 'round.id', 'result.round_id')
                .innerJoin('meetup', 'meetup.id', 'round.meetup_id')
                .innerJoin('user', 'user.id', 'result.user_id')
                .leftJoin("solve", 'result.id', 'solve.result_id')
                .select(({ fn }) => [
                    fn.min('result.value').over(ob => ob.orderBy('round.end_date asc').orderBy('result.mbld_score').partitionBy(['round.puzzle'])).as('cum_min'),
                    'user.name as user_name',
                    'user.id as user_id',
                    'user.region as user_region',
                    'meetup.id as meetup_id',
                    'meetup.name as meetup_name',
                    'round.end_date as date',
                    'result.mbld_score',
                    'result.mbld_total',
                    // TODO: check order
                    fn.agg<string[]>('array_agg', ['solve.time']).as('solves'),

                    'round.puzzle',
                ])
                .groupBy(['result.value', 'user.name', 'user.id', 'round.puzzle', 'round.end_date', 'meetup.id', 'result.mbld_score', 'result.mbld_total'])
                .where('result.value', '!=', Infinity)
                .$if(hasFilterRegion, qb => qb.where('user.region', '=', filterRegion))
                // Must order by time so distinct on picks correct value
                // solves desc is so null solves are at the top - which means a single
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
                .select(({ fn }) => [
                    fn.min('solve.time').over(ob => ob.orderBy('round.end_date', 'asc').partitionBy(['round.puzzle'])).as('cum_min'),
                    'user.name as user_name',
                    'user.id as user_id',
                    'user.region as user_region',
                    'meetup.id as meetup_id',
                    'meetup.name as meetup_name',
                    'round.end_date as date',
                    // TODO: check order

                    'round.puzzle',
                    'solve.time'

                ])
                .groupBy(['solve.time', 'user.name', 'user.id', 'round.puzzle', 'round.end_date', 'meetup.id'])
                .orderBy(['cum_min asc', 'time asc'])
                .where('solve.time', '!=', Infinity)
                .$if(hasFilterRegion, qb => qb.where('user.region', '=', filterRegion))
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
    const ret = {
        streamed: {}
    }

    return {
        streamed: {
            records: isDisplayCurrent ? records() : undefined,
            historicalRecords: !isDisplayCurrent ? historicalRecords() : undefined
        },
    }
}) satisfies PageServerLoad
