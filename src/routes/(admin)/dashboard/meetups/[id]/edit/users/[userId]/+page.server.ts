import prisma from '$lib/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getMeetupPuzzles } from "$lib/utilsServer"

export const load = (async ({ params }) => {
    const meetupId = Number(params.id);
    const userId = Number(params.userId);

    if (isNaN(meetupId) || isNaN(userId)) {
        throw error(404, 'not found')
    }

    const meetup = await prisma.meetup.findUnique({
        where: { 
            id: meetupId 
        },
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
                where: {
                    userId: userId
                },
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

    if (!meetup) {
        throw error(404, 'not found')
    }

    return { 
        puzzles: meetup.puzzles,
        user: meetup.users[0].user,
        registeredEvents: meetup.users[0].registeredEvents
    }
}) satisfies PageServerLoad


export const actions = {
    default: async ({ request, params }) => {
        const data = await request.formData();

        const events = data.get("events").split(":");

        await prisma.meetup.update({
            where: {
                id: Number(params.id)
            },
            data: {
                users: {
                    updateMany: {
                        where: {
                            userId: Number(params.userId)
                        },
                        data: {
                            registeredEvents: events
                        }
                    }
                }
            }
        })

        // TODO: help how to just submit and clear data? ? ? ? ? ?? , and keep on same page... don't go back to users?
        throw redirect(300, `/dashboard/meetups/${Number(params.id)}/edit/users`);
    }
}

