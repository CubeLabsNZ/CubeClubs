import { redirect } from "@sveltejs/kit"

export const load = (async ({ params }) => {
    redirect(303, `/dashboard/meetups/`);
})
