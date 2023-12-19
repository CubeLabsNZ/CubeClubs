import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserSessionOrThrow } from '$lib/utilsServer';

export const load = (async ({ cookies, params }) => {
    await getUserSessionOrThrow(cookies, true)

    const id = Number(params.id)
    if (isNaN(id)) {
        error(404, 'not found');
    }
    const meetup = await prisma.meetup.findUnique({
        where: { id: Number(params.id) },
        include: {
            club: true,
            organisers: {
                select: {
                    user: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                }
            },
            users: {
                select: {
                    user: {
                        select: {
                            name: true,
                            region: true,
                            id: true,
                        }
                    }
                }
            }
        }
    })

    if (!meetup) {
        error(404, 'not found');
    }

    return {
        meetup
    }
}) satisfies PageServerLoad
