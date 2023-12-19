import prisma from '$lib/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getMeetupPuzzles } from "$lib/utilsServer"

export const load = (async ({ params }) => {
    const meetupId = Number(params.id);
    const user_id = Number(params.user_id);

    if (isNaN(meetupId) || isNaN(user_id)) {
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
                    registered_events: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            region: true
                        }
                    }
                },
                where: {
                    user_id: user_id
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

    console.log("A")
    console.log(meetup.users[0])
    console.log("B")

    return { 
        puzzles: meetup.puzzles,
        user: meetup.users[0].user,
        registered_events: meetup.users[0].registered_events
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
                            user_id: Number(params.user_id)
                        },
                        data: {
                            registered_events: events
                        }
                    }
                }
            }
        })

        // TODO: help how to just submit and clear data? ? ? ? ? ?? , and keep on same page... don't go back to users?
        throw redirect(303, `/dashboard/meetups/${Number(params.id)}/edit/users`);
    }
}

