import type { LayoutServerLoad } from './$types';
import { getUserSessionOrThrow } from '$lib/utilsServer';

import { dev } from "$app/environment";
import { generateClubs } from "$lib/dev";

export const load = (async ({ cookies }) => {
    // if (dev) { generateClubs() }
    return {
        user: await getUserSessionOrThrow(cookies, true)
    };
}) satisfies LayoutServerLoad;
