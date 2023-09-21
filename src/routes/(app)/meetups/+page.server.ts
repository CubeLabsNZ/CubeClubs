import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import type { Meetup, Round } from '@prisma/client';
import { getMeetupPuzzles } from "$lib/utilsServer";

export const load = (async () => {
    const allMeetups: Meetup[] = await prisma.meetup.findMany({
        where: {
            is_published: true,
        },
        include: {
            club: true,
            rounds: true,
        },
        orderBy: {
            date: "asc"
        }
    })

    const meetups: { upcoming: Meetup[], ongoing: Meetup[], past: Meetup[] } = {
        upcoming: [],
        ongoing: [],
        past: []
    };

    for (const meetup of allMeetups) {
        meetup.puzzles = getMeetupPuzzles(meetup);
        delete meetup.rounds;

        if (meetup.date < new Date()) {
            meetups.past.push(meetup)
        } else if (meetup.date == new Date()){
            meetups.ongoing.push(meetup)
        } else {
            meetups.upcoming.push(meetup)
        }
    }

    meetups.past.sort((m1, m2) => m2.date.getTime() - m1.date.getTime());

    return meetups;
}) satisfies PageServerLoad;
