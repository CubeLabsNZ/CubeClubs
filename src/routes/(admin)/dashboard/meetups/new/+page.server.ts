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

        const meetup: Prisma.MeetupCreateInput = {
            name: data.get("name") as string,
            venue: data.get("venue") as string,
            location: data.get("location") as string,
            club: {
                connect: {
                    id: Number(data.get("clubId"))
                }
            },
            // TODO: actually make this work
            organisers: {
                connect: organisersList
            },
            contact: data.get("contact") as string,
            competitorLimit: Number(data.get("competitorLimit")),
            description: data.get("description") as string,
            date: new Date(data.get("date") as string),

            externalRegistrationLink: data.get("usingExternalRegistration") ? data.get("externalRegistrationLink") as string : null,
            registrationInformation: data.get("registrationInformation") ? data.get("registrationInformation") as string : undefined
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
        organisers: await prisma.user.findMany({where: {isClubOrganiser: true}})
    };
}) satisfies PageServerLoad;
