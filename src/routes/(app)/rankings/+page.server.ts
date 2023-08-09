import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';
import { Region, Puzzle } from '@prisma/client';

export const load = (async ( { url }) => {
    const filterPuzzle = url.searchParams.has("event") ? url.searchParams.get("event") : Puzzle.THREE;
    const filterFormat = url.searchParams.has("format") ? url.searchParams.get("format") : "single";
    const filterRegion = url.searchParams.has("region") ? url.searchParams.get("region") : "";

    const results = []

    // TODO: optimise? take less and then fetch after load?

    // WARN: this entire thing is so bad... so inefficient -> combine into one query, but filter out duplicates? how to take only 1 from each user?

    const { id } = await prisma.user.findFirst({
        take: 1,
        orderBy: {
            id: 'desc'
        }
    })

    for (let i = 0; i < id; i++) {
        const bestSingle = await prisma.solve.findFirst({
            where: {
                result: {
                    round: {
                        puzzle: filterPuzzle
                    },
                    user: {
                        id: i,
                    }
                },
            },
            take: 1,
            orderBy: {
                time: "asc"
            },
            select: {
                time: true,
                result: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                region: true,
                                id: true
                            }
                        },
                        round: {
                            select: {
                                meetup: {
                                    select: {
                                        name: true,
                                        id: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (bestSingle) {
            results.push(bestSingle);
        }
    } 

    results.sort((s1, s2) => s1.time - s2.time);

    return { results }
}) satisfies PageServerLoad


