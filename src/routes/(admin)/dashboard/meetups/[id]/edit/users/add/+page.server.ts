import prisma from '$lib/prisma';
import { redirect } from "@sveltejs/kit"
import type { Actions } from './$types';
import { invalidateAll } from '$app/navigation';

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
                            userId: selectedCompetitor,
                            registeredEvents: events
                        }]
                    }
                }
            }
        })

        // TODO: help how to just submit and clear data? ? ? ? ? ?? , and keep on same page... don't go back to users?
        throw redirect(300, `/dashboard/meetups/${Number(params.id)}/edit/users`);
    }
} satisfies Actions;
