import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getMeetupPuzzles } from "$lib/utilsServer"

export const load = (async ({ params }) => {
    const id = Number(params.id)
    if (isNaN(id)) {
        error(404, 'not found');
    }

    const meetup = await prisma.meetup.findUnique({
        where: { id: Number(params.id) },
        select: {
            id: true,
            name: true,
            users: {
                select: {
                    registered_events: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            region: true
                        }
                    }
                },
                orderBy: {
                    user: {
                        name: 'asc'
                    }
                }
            },
            rounds: {
                select: {
                    puzzle: true
                }
            }
        }
    })

    meetup.puzzles = getMeetupPuzzles(meetup);
    delete meetup.rounds;

    console.log(meetup)

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true
        }
    });

    if (!meetup) {
        error(404, 'not found');
    }

    return { 
        meetup,
        users
    }
}) satisfies PageServerLoad

