import type { Actions } from "./$types";
import prisma from "$lib/prisma";

export const actions = {
    default: async ({ request }) =>  {
        const data = await request.formData();

        const email = data.get("email");
        const password = data.get("password");
        const confirmPassword = data.get("confirmPassword");

        console.log(email, password, confirmPassword);

        const user = await prisma.user.create({
            data: {
                email: email,
                password: password
            },
        });
    }
} satisfies Actions
