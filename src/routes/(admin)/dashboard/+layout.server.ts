import type { LayoutServerLoad } from './$types';
import { getUserSessionOrThrow } from '$lib/utilsServer';

export const load = (async ({ cookies }) => {
    return {
        user: await getUserSessionOrThrow(cookies, true)
    };
}) satisfies LayoutServerLoad;
