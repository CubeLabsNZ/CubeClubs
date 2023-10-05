import prisma from '$lib/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Prisma } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/db';

export const load = (async ({ params }) => {
    const id = Number(params.id)
    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    const meetup = await prisma.meetup.findUnique({
        where: { id: Number(params.id) },
        select: {
            date: true,
            id: true,
            name: true,
            venue: true,
            location: true,
            organisers: {
                select: {
                    user: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                }
            },
            description: true,
            contact: true,
            competitor_limit: true,
            external_registration_link: true,
            registration_information: true,
            club_id: true
        }
    })

    if (!meetup) {
        throw error(404, 'not found')
    }

    return {
        clubs: await prisma.club.findMany(),
        organisers: await prisma.user.findMany({ where: { is_club_organiser: true }, select: {name: true, id: true} }),
        meetup
    }
}) satisfies PageServerLoad


export const actions = {
    default: async ({ request, params }) => {
        const data = await request.formData();
        const organisers = (data.get("organisers") as string).trim().split(" ").map(x => Number(x));

        console.log(organisers)

        const id = Number(params.id)
        if (isNaN(id)) {
            throw error(404)
        }

        if (organisers.length < 1 || organisers.some(x => isNaN(x))) {
            return fail(400)
        }

        await db.transaction().execute(async (trx) => {
            const res = await trx.updateTable('meetup')
                .set({
                    name: data.get("name") as string,
                    venue: data.get("venue") as string,
                    location: data.get("location") as string,
                    contact: data.get("contact") as string,
                    competitor_limit: Number(data.get("competitor_limit")),
                    description: data.get("description") as string,
                    date: new Date(data.get("date") as string),
                    club_id: Number(data.get("club_id")),

                    //external_registration_link: data.get("using_external_registration") ? data.get("external_registration_link") as string : null,
                    external_registration_link: data.get("external_registration_link") as string,
                    registration_information: data.get("registration_information") ? data.get("registration_information") as string : undefined
                })
                .where('meetup.id', '=', id)
                .executeTakeFirst()

            if (res.numUpdatedRows !== BigInt(1)) {
                throw error(400)
            }

            await trx.deleteFrom('organiser_in_meetup')
                .where('meetup_id', '=', id)
                .execute()

            await trx.insertInto('organiser_in_meetup')
                .values(organisers.map(organiser => ({user_id: Number(organiser), meetup_id: id})))
                .execute()

            return
        })

        // TODO: does this have success message?
        throw redirect(303, `/dashboard/meetups/${id}`)
    }
} satisfies Actions
