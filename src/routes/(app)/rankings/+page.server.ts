import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Puzzle } from '@prisma/client';

import puzzles from '$lib/data/puzzles'
import { islandRegions } from '$lib/data/regions';

export const load = (async () => {
    const results = {single: { allregions: {} }, average: {}}
    const temp = await prisma.solve.findMany({
        where: {
            result: {
                round: {
                    puzzle: Puzzle.THREE
                },
            },
        },
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
    const userIds = temp.map(({result}) => result.user.id)
    results.single.allregions[Puzzle.THREE] = temp.filter(({result}, index) => !userIds.slice(0, index).includes(result.user.id))


    return {
        results
    }
}) satisfies PageServerLoad
