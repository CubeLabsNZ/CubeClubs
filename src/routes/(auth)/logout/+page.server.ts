import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    cookies.delete("sessionId");
}) satisfies PageServerLoad;
