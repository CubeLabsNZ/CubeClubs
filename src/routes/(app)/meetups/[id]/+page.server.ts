import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { populateRounds, getMeetupPuzzles } from '$lib/utilsServer';
import type { Meetup } from '@prisma/client';

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
                    id: true,
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

    // TODO: check admin, can view "public page" in dashboard -> to here.
    if (!meetup || !meetup.isPublished) {
        throw error(404, 'not found');
    }

    const puzzles = getMeetupPuzzles(meetup);
    populateRounds(meetup.rounds)

    return {
        meetup,
        puzzles
    }
}) satisfies PageServerLoad
