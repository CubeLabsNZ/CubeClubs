import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { populateRounds } from '$lib/utilsServer';

export const load = (async ({ params }) => {

    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found');
    }
    const meetup = await prisma.meetup.findUnique({
        where: { id: Number(params.id) },
        include: {
            club: true,
            organisers: {
                select: {
                    name: true,
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
            },
            rounds: {
                orderBy: {
                    startDate: "asc"
                }
            }
        }
    })

    if (!meetup) {
        throw error(404, 'not found');
    }

    // TODO: check admin, and then add button "view public page" in dashboard
    if (!meetup.isPublished) {
        throw error(404, "not found")
    }

    populateRounds(meetup.rounds)

    return {
        meetup
    }
}) satisfies PageServerLoad
