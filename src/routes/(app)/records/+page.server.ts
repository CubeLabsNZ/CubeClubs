import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

import puzzles from '$lib/data/puzzles'

export const load = (async ({ params }) => {
    const records = {}
    for (const [key, puzzle] of Object.entries(puzzles)) {
        const single = await prisma.solve.findFirst({
            where: {
                result: {
                    round: {
                        puzzle: key
                    }
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

        if (!single) continue;

        const average = await prisma.result.findFirst({
            where: {
                round: {
                    puzzle: key
                }
            },
            orderBy: {
                average: 'asc'
            },
            select: {
                average: true,
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
        })

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
