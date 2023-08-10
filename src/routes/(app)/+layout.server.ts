import type { LayoutServerLoad } from './$types';
import { getUserSession } from '$lib/utilsServer';

import Module from "$lib/stats/a.out";

export const load = (async ({ cookies }) => {
    const m = await Module()
    console.log(m.ccall("yes"));

    return {
        user: await getUserSession(cookies)
    };
}) satisfies LayoutServerLoad;
