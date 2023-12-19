import prisma from '$lib/prisma';
import { getUserSessionOrThrow } from '$lib/utilsServer';

import { error } from "@sveltejs/kit"

// CANT LOOK UP TYPES TODO: HELP FIX

export const POST = (async ({params, cookies}) => {
    await getUserSessionOrThrow(cookies, true)

    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found')
    }

    await prisma.meetup.update({
        where: {
            id: id
        },
        data: {
            is_published: true
        }
    })

    return new Response()
});
