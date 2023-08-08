import prisma from '$lib/prisma';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserSessionOrThrow, populateRounds } from '$lib/utilsServer';

export const load = (async ({ params, cookies }) => {
    // FIXME: broken ? await getUserSessionOrThrow(cookies, true)

    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found');
    }
    const meetup = await prisma.meetup.findUnique({
        where: { id: Number(params.id) },
        include: {
            users: {
                select: {
                    user: {
                        select: {
                            name: true,
                            id: true,
                        }
                    }
                }
            },
            rounds: true
        }
    })

    if (!meetup) {
        throw error(404, 'not found');
    }

    populateRounds(meetup.rounds)

    // TODO: live resuts needs round
    return {
        meetup
    }
}) satisfies PageServerLoad

export const actions = {
    // You can update any meetup with this endpoint but it doesnt really matter since only events for the correct meetup will show up in the form
    default: async ({ cookies, params, request }) => {
        await getUserSessionOrThrow(cookies, true)
        const data = await request.formData()

        const eventId = Number(data.get("event"))
        const competitorId = Number(data.get("competitor"))

        // TODO: help
        const solves = [0,1,2,3,4].map((x) => Number(data.get(`solve-${x}`)))

        if (isNaN(eventId) || isNaN(competitorId) || solves.includes(NaN)) {
            return fail(400)
        }

        console.log(solves.map((time, idx) => ({index: idx, time: time})))

        const meetup = await prisma.round.update({
            where: { 
                id: eventId,
            },
            data: {
                results: {
                    create: {
                        // TODO: trim + other types of averages
                        value: solves.reduce((x, y) => x + y) / 5,
                        solves: {
                            createMany: {
                                data: solves.map((time, idx) => ({ index: idx, time: time }))
                            }
                        },
                        user: {
                            connect: {
                                id: competitorId
                            }
                        }
                    }
                }
            }
        })
    }
} satisfies Actions
