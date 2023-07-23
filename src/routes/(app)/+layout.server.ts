import type { LayoutServerLoad } from './$types';
import { getUserSession } from '$lib/utilsServer';

export const load = (async ({ cookies }) => {
    return {
        user: await getUserSession(cookies)
    };
}) satisfies LayoutServerLoad;
