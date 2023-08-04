// WARN: currently disabled as register feature not anticipated...

/* import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserSessionOrThrow } from '$lib/utilsServer';

export const load = (async ({ params, cookies }) => {
    const user = await getUserSessionOrThrow(cookies, false)

    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    // TODO: nice http error if already registered

    const userInMeetup = await prisma.meetup.update({
        where: { id },
        data: {
            users: {
                create: {
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            }
        }
    })

    if (!userInMeetup) {
        throw error(404, 'not found');
    }

    return {
        
    }
}) satisfies PageServerLoad */
