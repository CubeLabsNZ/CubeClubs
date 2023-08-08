import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Puzzle } from '@prisma/client';

import puzzles from '$lib/data/puzzles'
import { islandRegions } from '$lib/data/regions';

export const load = (async ({ params }) => {

    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found');
    }
    const user = await prisma.user.findUnique({
        where: { id: Number(params.id) },
        select: {
            name: true,
            id: true,
            region: true,
            results: {
                include: {
                    solves: true,
                }
            },
        }
    })

    if (!user) {
        throw error(404, 'not found');
    }

    const completedSolves = user.results.reduce((x,y) => x + y.solves.length, 0)
    // TODO: somehow include this in the first findUnique call?
    // TODO: maybe limit only to previous comps somehow?
    const meetupsAttended = prisma.userInMeetup.count({
        where: {
            userId: user.id,
        }
    });


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

    console.log(JSON.stringify(meetupsTop3Solves))
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

    console.log("AAA")
    console.log(meetupsTop3Solves[0].rounds[0])
    
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

    const records: {regional: RInfo, island: RInfo} = {
        regional: {single: 0, average: 0},
        island: {single: 0, average: 0}
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

        const countRRSingle = await prisma.solve.count({where: {time: {lt: single.time}, result: {user: {region: user.region}}}});
        const countIRSingle = await prisma.solve.count({where: {time: {lt: single.time}, result: {user: {region: {in: islandRegions(user.region)}}}}});

        if (countRRSingle == 0) records.regional.single++;
        if (countIRSingle == 0) records.island.single++;

        const countRRAverage = await prisma.result.count({where: {value: {lt: average.average}, user: {region: user.region}}})
        const countIRAverage = await prisma.result.count({where: {value: {lt: average.average}, user: {region: {in: islandRegions(user.region)}}}}) + 1


        PRs[key] = {single: {
            time: single.time,
            // TODO: IMPORTANT: Should meetups have a region? Or is it based on people for that region?
            RR: countRRSingle + 1,
            IR: countIRSingle + 1
        }, average: {
            time: average.average,
            RR: countRRAverage + 1,
            IR: countIRAverage + 1,
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

    // TODO: ask about records 
    //  - historical or current?
    //  - what is interclub
    //

    return {
        user,
        completedSolves,
        meetupsAttended,
        medals,
        results: {THREE: THREEresults},
        PRs,
        records
    }
}) satisfies PageServerLoad
