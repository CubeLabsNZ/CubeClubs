import prisma from '$lib/prisma';
import { redirect } from "@sveltejs/kit"
import type { Actions } from './$types';

export const actions = {
    default: async ({ request, params }) => {
        const data = await request.formData();

        const events = data.get("events").split(":");
        const selectedCompetitor = Number(data.get("competitor"));

        await prisma.meetup.update({
            where: {
                id: Number(params.id)
            },
            data: {
                users: {
                    createMany: {
                        data: [{
                            user_id: selectedCompetitor,
                            registered_events: events
                        }]
                    }
                }
            }
        })

        // TODO: help how to just submit and clear data? ? ? ? ? ?? , and keep on same page... don't go back to users?
        redirect(303, `/dashboard/meetups/${Number(params.id)}/edit/users`);
    }
} satisfies Actions;
