import type { PageServerLoad } from './$types';
import { getUserSessionOrThrow } from '$lib/utilsServer';

export const load = (async ({ cookies }) => {
    return {
        user: await getUserSessionOrThrow(cookies, false)
    };
}) satisfies PageServerLoad;
