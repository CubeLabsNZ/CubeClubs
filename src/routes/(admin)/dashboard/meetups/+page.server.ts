import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { partition } from '$lib/utils';

export const load = (async () => {
    const meetups = await prisma.meetup.findMany({
        // where: {
        //     isPublished: true,
        // },
        include: {
            club: true,
            rounds: true,
        }
    })

    for (const meetup of meetups) {
        meetup.puzzles = [... new Set(meetup.rounds.map(round => round.puzzle))];
        delete meetup.schedule;
    }

    const [publishedMeetups, draftMeetups] = partition(meetups, meetup => meetup.isPublished)

    return {
        publishedMeetups,
        draftMeetups,
    };
}) satisfies PageServerLoad;
