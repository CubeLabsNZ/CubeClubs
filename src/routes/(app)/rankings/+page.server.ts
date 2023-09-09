import { db } from '$lib/db';
import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';
import { Puzzle } from '@prisma/client';

export const load = (async ({ url }) => {
    console.log("load called");
    const filterRegion = url.searchParams.has("region") ? url.searchParams.get("region") : undefined;
    const filterEvent = url.searchParams.has("event") ? url.searchParams.get("event")! : Puzzle.THREE;
    const filterFormat = url.searchParams.has("format") ? url.searchParams.get("format") : "single";

    let query

    const isSingle = filterFormat === "single"

    if (isSingle) {
        query = db.with('temp', (eb) => eb.selectFrom('Solve')
            .innerJoin('Result', 'Result.id', 'Solve.resultId')
            .innerJoin('Round', 'Round.id', 'Result.roundId')
            .innerJoin('Meetup', 'Meetup.id', 'Round.meetupId')
            .innerJoin('User', 'User.id', 'Result.userId')
            .where('Round.puzzle', '=', filterEvent)
            .distinctOn('User.id')
            .select(['time', 'User.name as user_name', 'User.region as user_region', 'User.id as user_id', 'Meetup.id as meetup_id', 'Meetup.name as meetup_name'])
            .orderBy(['User.id asc', 'time asc'])
        )
            .selectFrom('temp')
            .orderBy('time', 'asc')
            .selectAll()

    } else {
        query = db.with('temp', (eb) => eb.selectFrom('Result')
            .innerJoin('Round', 'Round.id', 'Result.roundId')
            .innerJoin('Meetup', 'Meetup.id', 'Round.meetupId')
            .innerJoin('User', 'User.id', 'Result.userId')
            .leftJoin("Solve as solve", 'Result.id', 'solve.resultId')
            .where('Round.puzzle', '=', filterEvent)
            .distinctOn('User.id')
            .groupBy(['value', 'User.name', 'User.region', 'User.id', 'Meetup.id', 'Meetup.name'])
            .select(({ fn }) => [
                'value', 'User.name as user_name', 'User.region as user_region', 'User.id as user_id', 'Meetup.id as meetup_id', 'Meetup.name as meetup_name',
                // TODO: check order
                fn.agg<string[]>('array_agg', ['solve.time']).as('solves')
            ])
            .orderBy(['User.id asc', 'value asc'])
        )
            .selectFrom('temp')
            .orderBy('value', 'asc')
            .selectAll()
    }

    if (!(filterRegion === undefined || filterRegion === null || filterRegion === "undefined")) {
        query = query.where('user_region', '=', filterRegion)
    }

    const results = await query.execute()
    console.log(results)

    return { results, isSingle }
}) satisfies PageServerLoad
