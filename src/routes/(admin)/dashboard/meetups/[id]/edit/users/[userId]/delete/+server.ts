import prisma from '$lib/prisma';
import { getUserSessionOrThrow } from '$lib/utilsServer';

import { error } from "@sveltejs/kit"

export const POST = (async ({ params, cookies }) => {
    await getUserSessionOrThrow(cookies, true);

    const meetupId = Number(params.id);
    const userId = Number(params.userId);

    if (isNaN(meetupId) || isNaN(userId)) {
        throw error(404, 'not found')
    }

    await prisma.userInMeetup.delete({
        where: {
            userId_meetupId: {
                userId: userId,
                meetupId: meetupId
            }
        }
    })

    return new Response()
});
