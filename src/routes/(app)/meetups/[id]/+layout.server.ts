import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { populateRounds, getMeetupPuzzles } from '$lib/utilsServer';

export const load = (async ({ params }) => {
    const id = Number(params.id)

    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    const meetup = await prisma.meetup.findUnique({
        where: { id: id },
        include: {
            club: true,
            organisers: {
                select: {
                    user_id: true,
                    user: {
                        select: {
                            name: true
                        }
                    },
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
                    },
                    registered_events: true
                }
            },
            rounds: {
                orderBy: {
                    start_date: "asc"
                }
            }
        }
    })

    // TODO: check admin, can view "public page" in dashboard -> to here.
    if (!meetup || !meetup.is_published) {
        throw error(404, 'not found');
    }

    const puzzles = getMeetupPuzzles(meetup);
    const maxRounds = populateRounds(meetup.rounds)

    return {
        meetup,
        puzzles,
        maxRounds,
        slug: params.id
    }
}) satisfies LayoutServerLoad
