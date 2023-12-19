import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    /* @migration task: add path argument */ cookies.delete("sessionId");
}) satisfies PageServerLoad;
