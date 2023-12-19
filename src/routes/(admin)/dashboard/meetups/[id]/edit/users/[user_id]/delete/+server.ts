import prisma from '$lib/prisma';
import { getUserSessionOrThrow } from '$lib/utilsServer';

import { error } from "@sveltejs/kit"

export const POST = (async ({ params, cookies }) => {
    await getUserSessionOrThrow(cookies, true);

    const meetup_id = Number(params.id);
    const user_id = Number(params.user_id);

    if (isNaN(meetup_id) || isNaN(user_id)) {
        error(404, 'not found');
    }

    await prisma.user_in_meetup.delete({
        where: {
            user_id_meetup_id: {
                user_id: user_id,
                meetup_id: meetup_id
            }
        }
    })

    return new Response()
});
