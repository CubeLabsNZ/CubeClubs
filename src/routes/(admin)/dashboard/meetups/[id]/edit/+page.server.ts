import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    const meetup = await prisma.meetup.findUnique({
        where: { id: Number(params.id) },
        select: {
            date: true,
            id: true,
            name: true,
            venue: true,
            location: true,
            organisers: true,
            description: true,
            contact: true,
            competitor_limit: true,
            external_registration_link: true,
            registration_information: true,
            club_id: true
        }
    })

    if (!meetup) {
        throw error(404, 'not found')
    }

    return { 
        clubs: await prisma.club.findMany(),
        organisers: await prisma.user.findMany({where: {is_club_organiser: true}}),
        meetup
    }
}) satisfies PageServerLoad
