import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load = (async () => {
    const meetups = await prisma.meetup.findMany({
        where: {
            isPublished: true,
        },
        include: {
            club: true,
            rounds: true,
        }
    })

    for (const meetup of meetups) {
        meetup.puzzles = [... new Set(meetup.rounds.map(round => round.puzzle))];
        delete meetup.rounds;
    }


    const upcomingMeetups: any = []
    const ongoingMeetups: any = []
    const pastMeetups: any = []

    /* TODO: test this when schedule is avaialable
    for (const meetup of meetups) {
        const lastEventTime = Math.max(...meetup.schedule.map(sched => sched.endDate.getTime()))
        const firstEventTime = Math.min(...meetup.schedule.map(sched => sched.startDate.getTime()))

        if (lastEventTime < (new Date()).getTime()) {
            pastMeetups.push(meetup)
        } else if (firstEventTime > (new Date()).getTime()) {
            upcomingMeetups.push(meetup)
        } else {
            ongoingMeetups.push(meetup)
        }
    }
    */

   for (const meetup of meetups) {
       if (meetup.date < new Date()) {
           pastMeetups.push(meetup)
       } else {
           upcomingMeetups.push(meetup)
       }
   }

    return {
        upcomingMeetups,
        ongoingMeetups,
        pastMeetups
    };
}) satisfies PageServerLoad;
