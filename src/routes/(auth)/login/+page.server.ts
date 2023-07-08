import type { Actions } from "./$types";

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

        if (!user) { return { success: false, message: "this email doesn't exist. please try again" }; }
        

        const passIsCorrect = await argon2.verify(user.passHash, password as string);

        if (!passIsCorrect) { return { success: false, message: "password is incorrect. please try again"}}

        throw redirect(303, "/");
    }
} satisfies Actions

