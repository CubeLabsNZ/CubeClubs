import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Puzzle } from '@prisma/client';

import puzzles from '$lib/data/puzzles'
import { islandRegions } from '$lib/data/regions';

export const load = (async () => {
    const results = {single: { allregions: {} }, average: {}}
    results.single.allregions[Puzzle.THREE] = await prisma.solve.findMany({
        where: {
            result: {
                round: {
                    puzzle: Puzzle.THREE
                }
            },
        },
        take: 10,
        orderBy: {
            time: 'asc'
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


    return {
        results
    }
}) satisfies PageServerLoad
