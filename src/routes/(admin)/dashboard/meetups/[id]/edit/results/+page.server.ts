import prisma from '$lib/prisma';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserSessionOrThrow, populateRounds } from '$lib/utilsServer';
import { DNF, calculateAverage } from "$lib/utils";
import type { Format, Prisma } from "@prisma/client";
import formats from '$lib/data/formats';

export const load = (async ({ url, params, cookies }) => {
    // FIXME: broken ? await getUserSessionOrThrow(cookies, true)

    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    const queryRoundId = url.searchParams.get("round_id");

    let round_id: string | undefined;

    if (!url.searchParams.has("round_id")) {
        const round = await prisma.round.findFirst({
            where: {
                meetup_id: id
            },
            select: {
                id: true
            }
        })

        round_id = round?.id
    } else {
        round_id = queryRoundId
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

    if (round_id != undefined) {
        meetupQuery.include.rounds.include.results.where = { round_id: round_id };
    }

    const meetup = await prisma.meetup.findUnique(meetupQuery)

    if (!meetup) {
        throw error(404, 'not found');
    }

    populateRounds(meetup.rounds)

    // TODO: live resuts needs round
    return {
        round_id: round_id,
        meetup,
    }
}) satisfies PageServerLoad

export const actions = {
    // NOTE: You can update any meetup with this endpoint but it doesnt really matter since only events for the correct meetup will show up in the form

    default: async ({ cookies, request }) => {
        await getUserSessionOrThrow(cookies, true)
        const data = await request.formData()

        const eventId = Number(data.get("event"))
        const competitorId = Number(data.get("competitor"))

        const roundFormat = data.get("roundFormat") as Format;

        const solves = Array.from(Array(formats[roundFormat].count).keys()).map((x) => Number(data.get(`solve-${x}`) === "dnf" ? DNF : data.get(`solve-${x}`)))

        if (isNaN(eventId) || isNaN(competitorId) || solves.includes(NaN)) {
            return fail(400, { event: eventId, competitor: competitorId })
        }

        console.log(roundFormat);
        console.log(calculateAverage(data.get("roundFormat") as Format, solves));

        // TODO: make this compound ID later on
        const idToUpsert = (await prisma.result.findFirst({
            where: {
                round_id: eventId,
                user_id: competitorId
            }
        }))?.id

        // Just delete TODO: make this properly with kysely
        if (idToUpsert) {
            console.log(idToUpsert)
            await prisma.result.deleteMany({
                where: {
                    id: idToUpsert
                }
            })
        }

        const saveData = {
            value: calculateAverage(data.get("roundFormat") as Format, solves),
            solves: {
                createMany: {
                    data: solves.map((time, idx) => ({ index: idx, time: time }))
                }
            },
            user: {
                connect: {
                    id: competitorId
                }
            },
        }

        await prisma.round.update({
            where: {
                id: eventId,
            },
            data: {
                results: {
                    create: saveData
                }
            }
        })

        return { event: eventId }
    }
} satisfies Actions
