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
            competitorLimit: true,
            externalRegistrationLink: true,
            registrationInformation: true,
            clubId: true
        }
    })

    if (!meetup) {
        throw error(404, 'not found')
    }

    return { 
        clubs: await prisma.club.findMany(),
        organisers: await prisma.user.findMany({where: {isClubOrganiser: true}}),
        meetup
    }
}) satisfies PageServerLoad
