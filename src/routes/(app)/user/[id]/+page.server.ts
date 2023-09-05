import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Puzzle } from '@prisma/client';

import puzzles from '$lib/data/puzzles'
import { islandRegions } from '$lib/data/regions';
import { DNF } from '$lib/utils';
import { db } from '$lib/db';

export const load = (async ({ params }) => {

    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    const user = await prisma.user.findUnique({
        where: { 
            id: Number(params.id),
        },
        select: {
            name: true,
            id: true,
            region: true,
            results: {
                select: {
                    solves: {
                        where: {
                            NOT: {
                                time: DNF
                            }
                        }
                    }
                },
            },
            isClubOrganiser: true,
            _count: {
                select: {
                    competingIn: {
                        where: {
                            meetup: {
                                date: {
                                    lt: new Date()
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    if (!user) {
        throw error(404, 'not found');
    }

    const completedSolves = user.results.reduce((x,y) => x + y.solves.length, 0)


    // TODO: you have to make it to the last round for a medal right ?
    // TODO: make this groupBy round.groupBy?? need docs
    const meetupsTop3Solves = await prisma.meetup.findMany({
        select: {
            rounds: {
                orderBy: {
                    endDate: 'desc'
                },
                distinct: 'puzzle',
                select: {
                    results: {
                        orderBy: {
                            value: 'asc'
                        },
                        take: 3,
                        select: {
                            userId: true,
                            value: true
                        }
                    }
                }
            },
        }
    });

    // TODO: this is embarrassing,.. how to range?
    // TODO: is medal based on average or single?
    const medals = [0,1,2].map((medalIdx) => {
        // TODO: is there better function for count where X?
        let count = 0
        for (const meetup of meetupsTop3Solves) {
            for (const round of meetup.rounds) {
                if (round.results[medalIdx]?.userId == user.id) {
                    count++
                }
            }
        }
        return count
    })

    
    // TODO: figure out a way to get PRs with groupBy and min or discrete or smth
    //
    type PRInfo = {
        time: number,
        RR: number,
        IR: number,
        IcR: number
    }

    type RInfo = {
        single: number,
        average: number
    }

    const records: {regional: RInfo, island: RInfo, interclub: RInfo} = {
        regional: {single: 0, average: 0},
        island: {single: 0, average: 0},
        interclub: {single: 0, average: 0}
    }
    
    const PRs: {[key in Puzzle]: {single: PRInfo, average: PRInfo}} = {}

    for (const [key, puzzle] of Object.entries(puzzles)) {
        // TODO: plusTwo - consult - maybe DNF = inf
        const single = await prisma.solve.findFirst({
            where: {
                result: {
                    userId: user.id,
                    round: {
                        puzzle: key
                    }
                },
            },
            orderBy: {
                time: 'asc'
            }
        })

        if (!single) continue;

        const average = await prisma.result.findFirst({
            where: {
                userId: user.id,
                round: {
                    puzzle: key
                }
            },
            orderBy: {
                value: 'asc'
            }
        })

        if (!average) continue; // Should never happen

        const countSingleBaseQuery = db.selectFrom('Solve')
            .innerJoin('Result', 'Result.id', 'Solve.resultId')
            .innerJoin('Round', 'Round.id', 'Result.roundId')
            .innerJoin('User', 'User.id', 'Result.userId')
            .where('time', '<', single.time)
            .where('Round.puzzle', '=', key)
            .select(({ fn }) => [fn.count<number>('Result.userId').distinct().as("count")])

        const countRRSingle = Number((await countSingleBaseQuery.where('User.region', '=', user.region).executeTakeFirst())?.count)
        const countIRSingle = Number((await countSingleBaseQuery.where('User.region', 'in', islandRegions(user.region)).executeTakeFirst())?.count)
        const countIcRSingle = Number((await countSingleBaseQuery.executeTakeFirst())?.count)

        // If there are no times less than the users, he has the record
        if (countRRSingle == 0) records.regional.single++;
        if (countIRSingle == 0) records.island.single++;
        if (countIcRSingle == 0) records.interclub.single++;

        const getWhereRegionAverage = (region: EnumRegionFilter | Region) => ({where: {value: {lt: average.value}, round: {puzzle: key}, user: {region: region}}})
        const countAverageBaseQuery = db.selectFrom('Result')
            .innerJoin('Round', 'Round.id', 'Result.roundId')
            .innerJoin('User', 'User.id', 'Result.userId')
            .where('value', '<', single.time)
            .where('Round.puzzle', '=', key)
            .select(({ fn }) => [fn.count('Result.userId').distinct().as("count")])

        const countRRAverage = Number((await countAverageBaseQuery.where('User.region', '=', user.region).executeTakeFirst())?.count)
        const countIRAverage = Number((await countAverageBaseQuery.where('User.region', 'in', islandRegions(user.region)).executeTakeFirst())?.count)
        const countIcRAverage = Number((await countAverageBaseQuery.executeTakeFirst())?.count)

        if (countRRAverage == 0) records.regional.average++;
        if (countIRAverage == 0) records.island.average++;
        if (countIcRAverage == 0) records.interclub.average++;


        PRs[key] = {single: {
            time: single.time,
            RR: countRRSingle + 1,
            IR: countIRSingle + 1,
            IcR: countIcRSingle + 1,
        }, average: {
            time: average.value,
            RR: countRRAverage + 1,
            IR: countIRAverage + 1,
            IcR: countIcRAverage + 1
        }}
    }
    

    const THREEresults = await prisma.result.findMany({
        take: 10, // TODO: before push: change to 50
        where: {
            round: {
                puzzle: Puzzle.THREE
            },
            userId: user.id
        },
        orderBy: {
            // TODO: order by time or date?
            round: {
                endDate: 'desc'
            }
        }
    })

    return {
        user,
        completedSolves,
        medals,
        results: {THREE: THREEresults},
        PRs,
        records
    }
}) satisfies PageServerLoad
