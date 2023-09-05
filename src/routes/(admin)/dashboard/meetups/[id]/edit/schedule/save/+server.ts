import prisma from '$lib/prisma';
import { partition } from '$lib/utils';
import { getUserSessionOrThrow } from '$lib/utilsServer';

import { error } from "@sveltejs/kit"

// CANT LOOK UP TYPES TODO: HELP FIX

export const POST = (async ({request, params, cookies}) => {
    await getUserSessionOrThrow(cookies, true)

    // do we have a json reader? TODO: check and 404 if invalid params.id
    let events = JSON.parse((await request.body.getReader().read()).value.toString())

    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found')
    }

    events = events.filter((event) => event.editable)
    console.log(events)

    prisma.meetup.upsert

    await prisma.meetup.update({
        where: {
            id: id
        },
        data: {
            rounds: {
                upsert: events.map(event => ({
                    update: {
                        startDate: event.start,
                        endDate: event.end,
                        puzzle: event.extendedProps.puzzleType,
                        format: "AO5",
                        proceedNumber: 10,
                    },

                }))

            }
        }
    })
    return new Response()
});
