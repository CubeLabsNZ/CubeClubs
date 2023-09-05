import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getMeetupPuzzles } from "$lib/utilsServer"

export const load = (async ({ params }) => {
    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    const meetup = await prisma.meetup.findUnique({
        where: { id: Number(params.id) },
        select: {
            id: true,
            name: true,
            users: {
                select: {
                    registeredEvents: true,
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

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true
        }
    });

    if (!meetup) {
        throw error(404, 'not found')
    }

    return { 
        meetup,
        users
    }
}) satisfies PageServerLoad

