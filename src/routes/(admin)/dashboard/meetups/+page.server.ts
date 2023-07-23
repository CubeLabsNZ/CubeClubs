
import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { partition } from '$lib/utils';

export const load = (async () => {
    const meetups = await prisma.competition.findMany({
        where: {
            isPublished: true,
        },
        include: {
            club: true,
            schedule: true,
        }
    })

    for (const meetup of meetups) {
        meetup.puzzles = [... new Set(meetup.schedule.map(schedItem => schedItem.activity))]

        delete meetup.schedule
    }

	const [publishedCompetitions, draftCompetitions] = partition(meetups, meetup => meetup.isPublished)

    return {
        publishedCompetitions,
        draftCompetitions,
    };
}) satisfies PageServerLoad;
