import prisma from '$lib/prisma';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserSessionOrThrow, populateRounds } from '$lib/utilsServer';
import { DNF } from "$lib/utils";
import type { Prisma } from "@prisma/client";

export const load = (async ({ url, params, cookies }) => {
    // FIXME: broken ? await getUserSessionOrThrow(cookies, true)

    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    const queryRoundId = Number(url.searchParams.get("roundId"));

    let roundId: number | undefined;

    if (isNaN(queryRoundId) || !url.searchParams.has("roundId")) {
        const round = await prisma.round.findFirst({
            where: {
                meetupId: id
            },
            select: {
                id: true
            }
        })

        roundId = round?.id
    } else {
        roundId = queryRoundId
    }

    let meetupQuery = {
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
            rounds: {
                include: {
                    results: {
                        orderBy: {
                            value: 'asc'
                        },
                        select: {
                            user: {
                                select: {
                                    name: true
                                }
                            },
                            solves: {
                                orderBy: {
                                    index: 'asc'
                                },
                                select: {
                                    time: true
                                }
                            },
                            value: true,
                        }
                    }
                }
            }
        }
    }

    if (roundId != undefined) {
        meetupQuery.include.rounds.include.results.where = { roundId: roundId };
    }

    const meetup = await prisma.meetup.findUnique(meetupQuery)

    if (!meetup) {
        throw error(404, 'not found');
    }

    populateRounds(meetup.rounds)

    // TODO: live resuts needs round
    return {
        roundId: roundId,
        meetup,
    }
}) satisfies PageServerLoad

export const actions = {
    // NOTE: You can update any meetup with this endpoint but it doesnt really matter since only events for the correct meetup will show up in the form

    default: async ({ cookies, params, request }) => {
        await getUserSessionOrThrow(cookies, true)
        const data = await request.formData()

        const eventId = Number(data.get("event"))
        const competitorId = Number(data.get("competitor"))

        // TODO: check how many solves there are in the round
        const solves = Array.from(Array(5).keys()).map((x) => Number(data.get(`solve-${x}`) === "dnf" ? DNF : data.get(`solve-${x}`)))

        if (isNaN(eventId) || isNaN(competitorId) || solves.includes(NaN)) {
            return fail(400, { event: eventId, competitor: competitorId })
        }

        console.log(solves.map((time, idx) => ({index: idx, time: time})))

        const meetup = await prisma.round.update({
            where: { 
                id: eventId,
            },
            data: {
                results: {
                    // TODO: make create upsert, so if competitor selected again, it will override existing results (ALSO TODO: populate results if selects competitor that has already been entered)
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

        return { event: eventId }
    }
} satisfies Actions
