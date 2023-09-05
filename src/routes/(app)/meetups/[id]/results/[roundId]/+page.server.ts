import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import { populateRounds, getMeetupPuzzles } from "$lib/utilsServer";

export const load = (async ({ params }) => {
    const id = Number(params.id)

    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    const meetup = await prisma.meetup.findUnique({
        where: { id: id },
        include: {
            rounds: {
                include: {
                    results: {
                        include: {
                            solves: {
                                orderBy: {
                                    index: "asc"
                                }
                            },
                            user: {
                                select: {
                                    name: true,
                                    region: true
                                }
                            }
                        },
                        orderBy: {
                            value: "asc"
                        }
                    },
                },
                orderBy: {
                    startDate: "asc"
                }
            }
        },
    })



    // TODO: check admin, can view "public page" in dashboard -> to here.
    if (!meetup || !meetup.isPublished) {
        throw error(404, 'not found');
    }

    const puzzles = getMeetupPuzzles(meetup);
    const maxRounds = populateRounds(meetup.rounds)

    console.log(meetup.rounds);
    return {
        puzzles,
        rounds: meetup.rounds,
        maxRounds,
        meetupId: params.id,
        roundId: params.roundId
    }
})
