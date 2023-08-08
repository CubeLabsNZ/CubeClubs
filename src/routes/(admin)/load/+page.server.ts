import prisma from "$lib/prisma";

import { Region, Puzzle, Format, Prisma } from "@prisma/client";


import * as clubs from "../../../../temp/club.json";
import * as meetups from "../../../../temp/meetup.json";
import * as meetuptousers from "../../../../temp/meetuptouser.json";
import * as results from "../../../../temp/result.json";
import * as rounds from "../../../../temp/round.json";
import * as solves from "../../../../temp/solve.json";
import * as userinmeetups from "../../../../temp/userinmeetup.json";
import * as users from "../../../../temp/user.json";


const INF = 10000;

const tables = ["Club", "Meetup_id_seq", "Result_id_seq", "Round_id_seq", "Solve", "User_id_seq", "Club_id_seq", "Meetup", "_MeetupToUser", "Result", "Round", "Session", "User","UserInMeetup"]

async function cleanup() {
    for (const table in tables) {
        await prisma[table].deleteMany();
    }
}


const regions = {
    "Northland": Region.NORTHLAND,
    "Auckland": Region.AUCKLAND,
    "Waikato": Region.WAIKATO,
    "Bay of Plenty": Region.BOP,
    "Gisborne": Region.GISBORNE,
    "Hawke’s Bay": Region.HAWKES_BAY,
    "Taranaki": Region.TARANAKI,
    "Manawatu": Region.MANAWATU_WHANGANUI,
    "Wellington": Region.WELLINGTON,
    "Tasman": Region.TASMAN,
    "Nelson": Region.NELSON,
    "Marlborough": Region.MARLBOROUGH,
    "West Coast": Region.WEST_COAST,
    "Canterbury": Region.CANTERBURY,
    "Otago": Region.OTAGO,
    "Southland": Region.SOUTHLAND,

    "Visitor": Region.VISITOR
}

const puzzles = {
    "3x3x3": Puzzle.THREE,
    "2x2x2": Puzzle.TWO,
    "4x4x4": Puzzle.FOUR,
    "5x5x5": Puzzle.FIVE,
    "6x6x6": Puzzle.SIX,
    "7x7x7": Puzzle.SEVEN,
    "Square-1": Puzzle.SQ1,
    "Skewb": Puzzle.SKEWB,
    "Pyraminx": Puzzle.PYRA,
    "Megaminx": Puzzle.MEGA,
    "\"3x3x3 One Handed\"": Puzzle.OH,
    "3x3x3 One Handed": Puzzle.OH,
    "Clock": Puzzle.CLOCK,
    "FMC": Puzzle.FMC,
    "3BLD": Puzzle.THREEBLD,
    "THREEBLD": Puzzle.THREEBLD,
    "3MBLD": Puzzle.MULTIBLD,
    "4BLD": Puzzle.FOURBLD,
    "5BLD": Puzzle.FIVEBLD
}

const formats = {
    "ao5": Format.AO5,
    "bo3": Format.BO3,
    "bo1": Format.BO1,
    "mo3": Format.MO3
}



async function populateClubs() {
    await prisma.club.createMany({
        data: clubs.default
    });


    console.log("SUCCESS: populated clubs")
}


async function populateMeetups() {
    for (const meetup of meetups.default) {
        meetup.venue = meetup.venue_details + ", " + meetup.venue;
        delete meetup.venue_details

        if (typeof meetup.competitorLimit === "string") {
            meetup.competitorLimit = null
        }

        meetup.date = new Date(Date.parse(meetup.date.slice(0, 10)));
        meetup.registrationInformation = "",
        meetup.isPublished = true;
    }

    for (const meetup of meetups.default) {
        await prisma.meetup.create({
            data: {
                clubId: {
                    connect: {
                        id: meetup.clubId
                    }
                },
                name: meetup.name,
                venue: meetup.venue,
                location: meetup.location,
                contact: meetup.contact,
                competitorLimit: meetup.competitorLimit === "" ? 1 : meetup.competitorLimit,
                description: meetup.description,
                date: new Date(meetup.date),
                externalRegistrationLink: meetup.externalRegistrationLink,
                registrationInformation: meetup.registrationInformation,
                ...meetup
            }
        })
    }

    console.log("SUCCESS: populated meetups")
}


async function populateUsers() {
    let seenEmails = [], usersSet = [];

    for (const user of users.default) {
        user.region = regions[user.region];
        user.isClubOrganiser = false;

        if (!seenEmails.find(e => e === user.email)) {
            seenEmails.push(user.email)
            usersSet.push(user)
        }
    }

    for (const user of usersSet) {
        await prisma.user.create({
            data: user
        })
    }

    console.log("SUCCESS: populated users")
}


async function populateUsersInMeetups() {
    for (const x of userinmeetups.default) {
        let a = x.registeredEvents.trim();
        a = a.slice(1, a.length - 1).split(",").map(e => puzzles[e]);

        if (!x.userId || !x.meetupId) {
            console.log("empty value")
            continue;
        }

        const user = await prisma.user.findFirst({
            where: {
                id: x.userId
            }
        })

        const meetup = await prisma.meetup.findFirst({
            where: {
                id: x.meetupId
            }
        })

        if (!user) { 
            console.log("user doesn't exist:", x.userId)
            continue; 
        }

        if (!meetup) {
            console.log("meetup doesn't exist: ", x.meetupId)
            continue;
        }

        await prisma.meetup.update({
            where: {
                id: x.meetupId
            },
            data: {
                users: {
                    create: {
                        user: {
                            connect: {
                                id: x.userId
                            }
                        },
                        registeredEvents: a
                    }
                }
            }
        })
    }

    console.log("SUCCESS: populated users in meetups")
}


async function populateOrganisers() {
    for (const x of meetuptousers.default) {
        const meetup = await prisma.meetup.findUnique({
            where: {
                id: x.meetupId
            },
            select: {
                organisers: true
            }
        })

        if (!meetup) { 
            console.log("meetup doesn't exist: ", x.meetupId);
            continue;
        }

        const currentOrganisers = [];
        if (meetup.organisers.length != 0) {
            for (const org of meetup.organisers) {
                currentOrganisers.push({id: Number(org.id)})
            }
        }

        const organisers = ((meetup.organisers.length === 0) ? [{ id: x.userId }] : [...currentOrganisers, {id: x.userId}]);
        console.log(organisers);

        await prisma.meetup.update({
            where: {
                id: x.meetupId
            },
            data: {
                organisers: {
                    connect: organisers
                }
            }
        })
    }

    console.log("SUCCESS: populated organisers in meetups")
}


async function populateRounds() {
    for (const round of rounds.default) {
        if (round.puzzle == "" || round.format == "") {
            console.log("BREAK DETECTED")
            continue;
        }


        await prisma.meetup.update({
            where: {
                id: round.meetupId
            },
            data: {
                rounds: {
                    create: {
                        startDate: new Date(round.startDate),
                        endDate: new Date(round.endDate),
                        puzzle: puzzles[round.puzzle],
                        format: formats[round.format.toLowerCase()],
                        proceedNumber: round.proceedNumber === "" ? 0 : round.proceedNumber,
                        id: round.id
                    }
                }
            }
        })
    }

    console.log("SUCCESS: populated rounds")
}


async function populateResults() {
    for (const result of results.default) {
        await prisma.round.update({
            where: {
                id: result.roundId
            },
            data: {
                results: {
                    createMany: {
                        data: [{
                            id: result.id,
                            value: result.result == "" ? INF : result.result,
                            userId: result.userId,
                        }]
                    }
                }
            }
        })
    }

    console.log("SUCCESS: populated results")
}


async function populateSolves() { 
    const groupedSolves = new Array(7000).fill(0).map(x => []);


    for (const solve of solves.default) {
        if (solve.resultId === "") { continue; }

        groupedSolves[solve.resultId].push({
            id: solve.id,
            time: (solve.penalty === "DNF" || solve.time === "") ? INF : solve.time
        });
    }

    groupedSolves.forEach((x, i) => {
        if (x.length > 0) {
            const initial = x[0].id;

            x.forEach((s, j) => {
                groupedSolves[i][j].id = s.id - initial
            })
        }
    })

    for (let i = 0; i < 7000; ++i) {
        if (groupedSolves[i].length > 0) {
            // const solvesPerResult: Prisma.SolveCreateManyResultInput = groupedSolves[i].map(s => ({ index: s.id, time: s.time, }));
            // console.log(solvesPerResult)

            // for (const gs of groupedSolves[i]) {
            //     console.log(gs)

            //     await prisma.result.update({
            //         where: {
            //             id: i
            //         },
            //         data: {
            //             solves: {
            //                 createMany: {
            //                     data: [{ index: gs.id, time: gs.time }]
            //                 }
            //             } 
            //         }
            //     })
            // }
            


            await prisma.result.update({
                where: {
                    id: i
                },
                data: {
                    solves: {
                        createMany: {
                            data: groupedSolves[i].map(s => ({ index: s.id, time: s.time, }))
                        }
                    } 
                }
            })
        }
    }

    console.log("SUCCESS: populated solves")
}




export const load = (async () => {
    await populateClubs();
    await populateMeetups();
    await populateUsers();
    await populateUsersInMeetups()
    await populateOrganisers();
    await populateRounds();

    await populateResults();

    await populateSolves();
})
