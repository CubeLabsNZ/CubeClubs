
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

	const [publishedCompetitions, draftCompetitions] = partition(meetups, meetup => meetup.isPublished)

    return {
        publishedCompetitions,
        draftCompetitions,
    };
}) satisfies PageServerLoad;
