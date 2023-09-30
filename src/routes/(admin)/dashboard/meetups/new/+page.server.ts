import prisma from '$lib/prisma';
import type { Prisma } from '@prisma/client'
import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const actions = {
    default: async ({request}) => {
        const data = await request.formData();
        const organisers = (data.get("organisers") as string).trim().split(" ");

        if (organisers.length < 1) {
            return fail(400)
        }

        // WARN: using map doesn't work for some reason?
        const organisersList = [];
        for (const org of organisers) {
            organisersList.push({id: Number(org)})
        }

        const meetup: Prisma.meetupCreateInput = {
            name: data.get("name") as string,
            venue: data.get("venue") as string,
            location: data.get("location") as string,
            club: {
                connect: {
                    id: Number(data.get("club_id"))
                }
            },
            organisers: {
                createMany: {
                    data: organisers.map(organiser => ({
                        user_id: Number(organiser)
                    }))
                }
            },
            contact: data.get("contact") as string,
            competitor_limit: Number(data.get("competitor_limit")),
            description: data.get("description") as string,
            date: new Date(data.get("date") as string),

            external_registration_link: data.get("using_external_registration") ? data.get("external_registration_link") as string : null,
            registration_information: data.get("registration_information") ? data.get("registration_information") as string : undefined
        }

        // TODO: validate that every organizer really is an organizer
        // should be fine cause only trusted people can access this endpoint
        const createdMeetup = await prisma.meetup.create({
            data: meetup
        })

        // TODO: does this have success message?
        throw redirect(303, `/dashboard/meetups/${createdMeetup.id}`)
    }
} satisfies Actions;

export const load = (async () => {
    return {
        clubs: await prisma.club.findMany(),
        organisers: await prisma.user.findMany({where: {is_club_organiser: true}})
    };
}) satisfies PageServerLoad;
