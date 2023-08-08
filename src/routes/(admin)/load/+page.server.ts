import prisma from "$lib/prisma";

import { Region, Puzzle, Format } from "@prisma/client";


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
    "Clock": Puzzle.CLOCK,
    "FMC": Puzzle.FMC,
    "3BLD": Puzzle.THREEBLD,
    "3MBLD": Puzzle.MULTIBLD,
    "4BLD": Puzzle.FOURBLD,
    "5BLD": Puzzle.FIVEBLD
}

async function populateClubs() {
    await prisma.club.createMany({
        data: clubs.default
    });
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
                        }
                    }
                }
            }
        })
    }
}

export const load = (async () => {
    await populateClubs();
    await populateMeetups();
    await populateUsers();
    await populateUsersInMeetups()
})
