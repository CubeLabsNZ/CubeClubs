import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

import puzzles from '$lib/data/puzzles'
import { db } from '$lib/db';

export const load = (async ({ url }) => {
    const filterRegion = url.searchParams.has("region") ? url.searchParams.get("region") : undefined;

    const records = {}

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

        
        if (!(filterRegion === undefined || filterRegion === null || filterRegion === "undefined")) {
            singleQuery = singleQuery
                .where('user.region', '=', filterRegion)
        }


        const single = await singleQuery.executeTakeFirst()

        // TODO: if mbld return single only
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
                // TODO: check order
                eb.fn.agg<number[]>('array_agg', ['solve.time']).as('solves')
            ])
            .where('round.puzzle', '=', key)
            .groupBy(['result.value', 'user.id', 'user.name', 'user.region', 'meetup.id', 'meetup.name'])
            .orderBy('value asc')

        if (!(filterRegion === undefined || filterRegion === null || filterRegion === "undefined")) {
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


    return {
        records
    }
}) satisfies PageServerLoad
