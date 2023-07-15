import type { Actions } from "./$types";
import { fail } from "@sveltejs/kit";

import prisma from "$lib/prisma";

import argon2 from "argon2";
import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) =>  {
        const data = await request.formData();

        const email = data.get("email");
        const password = data.get("password");

        const user = await prisma.user.findUnique({
            where: {
                email: email as string
            }
        });

        if (!user) { 
            return fail(400, { email, error: "email" });
        }
        

        const passIsCorrect = await argon2.verify(user.passHash, password as string);

        if (!passIsCorrect) { 
            return fail(401, { email, error: "pass"})
        }

        throw redirect(303, "/");
    }
} satisfies Actions

export const _EMAIL_MESSAGE = "this email doesn't exist. please try again";
