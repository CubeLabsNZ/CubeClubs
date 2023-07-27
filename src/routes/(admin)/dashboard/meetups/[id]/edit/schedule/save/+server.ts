import prisma from '$lib/prisma';
import { partition } from '$lib/utils';
import { getUserSessionOrThrow } from '$lib/utilsServer';

import { success, error } from "@sveltejs/kit"

// CANT LOOK UP TYPES TODO: HELP FIX

export const POST = (async ({request, params, cookies}) => {
    getUserSessionOrThrow(cookies, true)

    // do we have a json reader? TODO: check and 404 if invalid params.id
    const events = JSON.parse((await request.body.getReader().read()).value.toString())
    console.log(events)

    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found')
    }

    await prisma.meetup.update({
        where: {
            id: id
        },
        data: {
            rounds: {
                deleteMany: {},
                createMany: {
                    data: events.map(event => ({
                        startDate: event.start,
                        endDate: event.end,
                        puzzle: event.extendedProps.puzzleType,
                        format: "AO5",
                        proceedNumber: 10,
                    }))
                }
            }
        }
    })
    return success(200)
});
