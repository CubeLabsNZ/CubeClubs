import { db } from '$lib/db';
import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';
import { Puzzle } from "$lib/db/enums"
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url }) => {
    const filterRegion = url.searchParams.has("region") ? url.searchParams.get("region")! : undefined;
    const filterEvent = url.searchParams.get("event");
    const filterFormat = url.searchParams.get("format");

    if (!filterEvent || !filterFormat) {
        redirect(303, '/rankings?format=single&event=THREE');
    }

    let query

    const isSingle = filterFormat === "single"
    const isMbld = filterEvent === "MULTIBLD"

    if (isSingle && !isMbld) {
        query = db.with('temp', (eb) => eb.selectFrom('solve')
            .innerJoin('result', 'result.id', 'solve.result_id')
            .innerJoin('round', 'round.id', 'result.round_id')
            .innerJoin('meetup', 'meetup.id', 'round.meetup_id')
            .innerJoin('user', 'user.id', 'result.user_id')
            .where('round.puzzle', '=', filterEvent)
            .where('solve.time', '!=', Infinity)
            .distinctOn('user.id')
            .select(['time', 'user.name as user_name', 'user.region as user_region', 'user.id as user_id', 'meetup.id as meetup_id', 'meetup.name as meetup_name'])
            .orderBy(     ['user.id asc', 'time asc'])
        )
            .selectFrom('temp')
            .orderBy('time', 'asc')
            .selectAll()

    } else {
        query = db.with('temp', (eb) => eb.selectFrom('result')
            .innerJoin('round', 'round.id', 'result.round_id')
            .innerJoin('meetup', 'meetup.id', 'round.meetup_id')
            .innerJoin('user', 'user.id', 'result.user_id')
            .leftJoin("solve", 'result.id', 'solve.result_id')
            .where('round.puzzle', '=', filterEvent)
            .where('result.value', '!=', Infinity)
            .distinctOn('user.id')
            .groupBy(['value', 'user.name', 'user.region', 'user.id', 'meetup.id', 'meetup.name', 'result.mbld_score', 'result.mbld_total'])
            .select(({ fn }) => [
                'value', 'user.name as user_name', 'user.region as user_region', 'user.id as user_id', 'meetup.id as meetup_id', 'meetup.name as meetup_name', 'result.mbld_score', 'result.mbld_total',
                // TODO: check order
                fn.agg<string[]>('array_agg', ['solve.time']).as('solves')
            ])
            .orderBy(     ['user.id asc', 'value asc'])
        )
            .selectFrom('temp')
            .orderBy(['temp.mbld_score desc', 'value asc'])
            .selectAll()
    }

    if (!(filterRegion === undefined || filterRegion === null || filterRegion === "undefined")) {
        query = query.where('user_region', '=', filterRegion)
    }

    return {
        streamed: {
            results: query.execute()
        }, isSingle
    }
}) satisfies PageServerLoad
