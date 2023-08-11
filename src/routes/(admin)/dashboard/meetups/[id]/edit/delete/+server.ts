import prisma from '$lib/prisma';
import { getUserSessionOrThrow } from '$lib/utilsServer';

import { error } from "@sveltejs/kit"

export const POST = (async ({params, cookies}) => {
    await getUserSessionOrThrow(cookies, true)

    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found')
    }

    await prisma.meetup.delete({
        where: {
            id: id
        },
    })

    return new Response()
});

