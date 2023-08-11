import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';
import { Puzzle } from '@prisma/client';

export const load = (async ({ url }) => {
    console.log("load called");
    const filterRegion = url.searchParams.has("region") ? url.searchParams.get("region") : undefined;
    const filterEvent = url.searchParams.has("event") ? url.searchParams.get("event") : Puzzle.THREE;

    // WARN: disabled for now as it doesn't seem to refetch load...
    // const filterFormat = url.searchParams.has("format") ? url.searchParams.get("format") : "single";

    const results = {single: {}, average: {}};

    // if (filterFormat === "single") {
    const singleQuery = {
        where: {
            result: {
                round: {
                    puzzle: filterEvent
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
        singleQuery.where.result.user = { region: filterRegion };
    }



    const singleTemp = await prisma.solve.findMany(singleQuery);

    const singleUserIds = singleTemp.map(({result}) => result.user.id)

    results.single[filterEvent] = singleTemp.filter(({result}, index) => !singleUserIds.slice(0, index).includes(result.user.id))
    // } else {
    const averageQuery = {
        where: {
            round: {
                puzzle: filterEvent
            },
        },
        orderBy: {
            value: 'asc'
        },
        select: {
            value: true,
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
                    },
                    format: true
                }
            },
            solves: true
        }
    }

    if (!(filterRegion === undefined || filterRegion === null || filterRegion === "undefined")) {
        averageQuery.where.user = { region: filterRegion };
    }


    const averageTemp = await prisma.result.findMany(averageQuery);

    const averageUserIds = averageTemp.map(r => r.user.id);

    results.average[filterEvent] = averageTemp.filter((result, index) => !averageUserIds.slice(0, index).includes(result.user.id))
    // }



    return { results }
}) satisfies PageServerLoad
