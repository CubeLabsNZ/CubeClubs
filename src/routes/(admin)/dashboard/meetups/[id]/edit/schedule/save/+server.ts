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
        error(404, 'not found');
    }

    //events = events.filter((event) => event.editable)

    await db.transaction().execute(async (trx) => {
        if (events.update.length) {
            await trx.insertInto('round')
                .values(events.update.map(event => ({
                    id: event.id,
                    meetup_id: id,
                    start_date: event.start,
                    end_date: event.end,
                    puzzle: event.extendedProps.puzzleType,
                    format: event.extendedProps.formatType,
                    proceed_number: event.extendedProps.proceed_number ?? 0,
                })))
                .onConflict((oc) => oc.column('id')
                    .doUpdateSet((eb) => ({
                        start_date: eb.ref('excluded.start_date'),
                        end_date: eb.ref('excluded.end_date'),
                    })))
                .execute()
        }

        if (events.delete.length) {
            await trx.deleteFrom('round')
                .where('id', 'in', events.delete)
                .execute()
        }
    })
    return new Response()
});
