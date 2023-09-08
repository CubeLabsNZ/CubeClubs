import { db } from '$lib/db';
import prisma from '$lib/prisma';
import { partition } from '$lib/utils';
import { getUserSessionOrThrow } from '$lib/utilsServer';

import { error } from "@sveltejs/kit"
import type { RequestHandler } from './$types';

// CANT LOOK UP TYPES TODO: HELP FIX

export const POST: RequestHandler = (async ({ request, params, cookies }) => {
    await getUserSessionOrThrow(cookies, true)

    // do we have a json reader? TODO: check and 404 if invalid params.id
    let events = JSON.parse((await request.body.getReader().read()).value.toString())

    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found')
    }

    //events = events.filter((event) => event.editable)
    console.log(events)

    await db.transaction().execute(async (trx) => {
        await trx.deleteFrom('Round')
            .where('meetupId', '=', id)
            .execute()

        await trx.insertInto('Round')
            .values(events.map(event => ({
                meetupId: id,
                startDate: event.start,
                endDate: event.end,
                puzzle: event.extendedProps.puzzleType,
                format: event.extendedProps.formatType,
                proceedNumber: event.extendedProps.proceedNumber,
            })))
            .execute()

    })

    return new Response()
});
