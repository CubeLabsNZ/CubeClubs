import { invalidateAll } from "$app/navigation"
import { redirect } from "@sveltejs/kit"

export const load = () => {
    invalidateAll();
    redirect(303, "/");
}
