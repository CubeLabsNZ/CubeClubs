import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies, params }) => {
    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    const meetup = await prisma.meetup.findUnique({
        where: { id: Number(params.id) },
        select: {
            date: true,
        }
    })

    console.log(meetup);

    return { meetup }
}) satisfies PageServerLoad

