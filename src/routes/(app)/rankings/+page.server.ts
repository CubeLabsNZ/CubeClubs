import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Puzzle } from '@prisma/client';

import puzzles from '$lib/data/puzzles'
import { islandRegions } from '$lib/data/regions';

export const load = (async ({ url }) => {
    const filterRegion = url.searchParams.has("region") ? url.searchParams.get("region") : undefined;

    const results = {single: {}, average: {}};

    const query = {
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
    }

    if (!(filterRegion === undefined || filterRegion === null || filterRegion === "undefined")) {
        query.where.result.user = { region: filterRegion };
    }

    const temp = await prisma.solve.findMany(query);

    const userIds = temp.map(({result}) => result.user.id)
    results.single[Puzzle.THREE] = temp.filter(({result}, index) => !userIds.slice(0, index).includes(result.user.id))


    return {
        results
    }
}) satisfies PageServerLoad
