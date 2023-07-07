import type { Actions } from "./$types";
import { PrismaClient } from '@prisma/client'

export const actions = {
    default: async ({ request }) =>  {

        const data = await request.formData();

        const email = data.get("email");
        const password = data.get("password");

        console.log(email, password);
    }
} satisfies Actions;
