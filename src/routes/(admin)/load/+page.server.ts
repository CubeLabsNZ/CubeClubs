import prisma from "$lib/prisma";

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


export const load = (async () => {
    // await cleanup();

    // await prisma.club.createMany({
    //     data: clubs.default
    // });

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
})
