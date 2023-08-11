import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

import puzzles from '$lib/data/puzzles'

export const load = (async ({ url }) => {
    const filterRegion = url.searchParams.has("region") ? url.searchParams.get("region") : undefined;

    const records = {}

    for (const [key, puzzle] of Object.entries(puzzles)) {
        const singleQuery = {
            where: {
                result: {
                    round: {
                        puzzle: key
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


        const single = await prisma.solve.findFirst(singleQuery)

        if (!single) continue;

        const averageQuery = {
            where: {
                round: {
                    puzzle: key
                }
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
                solves: {
                    select: {
                        time: true,
                    },
                    orderBy: {
                        index: 'asc'
                    }
                },
                round: {
                    select: {
                        meetup: {
                            select: {
                                name: true,
                                id: true,
                            }
                        }
                    }
                }
            }
        }

        if (!(filterRegion === undefined || filterRegion === null || filterRegion === "undefined")) {
            averageQuery.where.user = { region: filterRegion };
        }

        const average = await prisma.result.findFirst(averageQuery);

        if (!average) continue; // Should never happen

        records[key] = {
            single: single,
            average: average
        }
    }


    return {
        records
    }
}) satisfies PageServerLoad
