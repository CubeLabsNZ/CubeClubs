import prisma from "$lib/prisma";

import { DNF } from "$lib/utils";

import { region, puzzle, format, Prisma } from "@prisma/client";


import * as clubs from "../../../../temp/club.json";
import * as meetups from "../../../../temp/meetup.json";
import * as meetuptousers from "../../../../temp/meetuptouser.json";
import * as results from "../../../../temp/result.json";
import * as rounds from "../../../../temp/round.json";
import * as solves from "../../../../temp/solve.json";
import * as userinmeetups from "../../../../temp/userinmeetup.json";
import * as users from "../../../../temp/user.json";


const tables = ["Club", "Meetup_id_seq", "Result_id_seq", "Round_id_seq", "Solve", "User_id_seq", "Club_id_seq", "Meetup", "_MeetupToUser", "Result", "Round", "Session", "User","UserInMeetup"]

async function cleanup() {
    for (const table in tables) {
        await prisma[table].deleteMany();
    }
}


const regions = {
    "Northland": region.NORTHLAND,
    "Auckland": region.AUCKLAND,
    "Waikato": region.WAIKATO,
    "Bay of Plenty": region.BOP,
    "Gisborne": region.GISBORNE,
    "Hawke’s Bay": region.HAWKES_BAY,
    "Taranaki": region.TARANAKI,
    "Manawatu": region.MANAWATU_WHANGANUI,
    "Wellington": region.WELLINGTON,
    "Tasman": region.TASMAN,
    "Nelson": region.NELSON,
    "Marlborough": region.MARLBOROUGH,
    "West Coast": region.WEST_COAST,
    "Canterbury": region.CANTERBURY,
    "Otago": region.OTAGO,
    "Southland": region.SOUTHLAND,

    "Visitor": region.VISITOR
}

const puzzles = {
    "3x3x3": puzzle.THREE,
    "2x2x2": puzzle.TWO,
    "4x4x4": puzzle.FOUR,
    "5x5x5": puzzle.FIVE,
    "6x6x6": puzzle.SIX,
    "7x7x7": puzzle.SEVEN,
    "Square-1": puzzle.SQ1,
    "Skewb": puzzle.SKEWB,
    "Pyraminx": puzzle.PYRA,
    "Megaminx": puzzle.MEGA,
    "\"3x3x3 One Handed\"": puzzle.OH,
    "3x3x3 One Handed": puzzle.OH,
    "Clock": puzzle.CLOCK,
    "FMC": puzzle.FMC,
    "3BLD": puzzle.THREEBLD,
    "THREEBLD": puzzle.THREEBLD,
    "3MBLD": puzzle.MULTIBLD,
    "4BLD": puzzle.FOURBLD,
    "5BLD": puzzle.FIVEBLD
}

const formats = {
    "ao5": format.AO5,
    "bo3": format.BO3,
    "bo1": format.BO1,
    "mo3": format.MO3
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

        if (typeof meetup.competitor_limit === "string") {
            meetup.competitor_limit = null
        }

        meetup.date = new Date(Date.parse(meetup.date.slice(0, 10)));
        meetup.registration_information = "",
        meetup.isPublished = true;
    }

    for (const meetup of meetups.default) {
        await prisma.meetup.create({
            data: {
                club_id: {
                    connect: {
                        id: meetup.club_id
                    }
                },
                name: meetup.name,
                venue: meetup.venue,
                location: meetup.location,
                contact: meetup.contact,
                competitor_limit: meetup.competitor_limit === "" ? 1 : meetup.competitor_limit,
                description: meetup.description,
                date: new Date(meetup.date),
                external_registration_link: meetup.external_registration_link,
                registration_information: meetup.registration_information,
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

        if (!x.user_id || !x.meetupId) {
            console.log("empty value")
            continue;
        }

        const user = await prisma.user.findFirst({
            where: {
                id: x.user_id
            }
        })

        const meetup = await prisma.meetup.findFirst({
            where: {
                id: x.meetupId
            }
        })

        if (!user) { 
            console.log("user doesn't exist:", x.user_id)
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
                                id: x.user_id
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

        const organisers = ((meetup.organisers.length === 0) ? [{ id: x.user_id }] : [...currentOrganisers, {id: x.user_id}]);
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
                        start_date: new Date(round.start_date),
                        end_date: new Date(round.end_date),
                        puzzle: puzzles[round.puzzle],
                        format: formats[round.format.toLowerCase()],
                        proceed_number: round.proceed_number === "" ? 0 : round.proceed_number,
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
                            value: result.result == "" ? DNF : result.result,
                            user_id: result.user_id,
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
            time: (solve.penalty === "DNF" || solve.time === "") ? DNF : solve.time
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
