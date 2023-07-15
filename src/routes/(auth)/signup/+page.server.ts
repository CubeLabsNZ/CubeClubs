import type { Actions } from "./$types";
import type { Region, Gender } from "@prisma/client";

import prisma from "$lib/prisma";

import argon2 from "argon2";

export const actions = {
    default: async ({ request }) =>  {
        const data = await request.formData();

        const email = data.get("email");
        const password = data.get("password");
        const confirmPassword = data.get("confirmPassword");
        const region = data.get("region");

        if (password !== confirmPassword) { return { success: false, message: "the two passwords entered do not match, please try again." }; }

        const userExists = await prisma.user.count({
            where: {
                email: email as string
            }
        });

        if (userExists > 0) { return { success: false, message: "email exists" }; }

        const hash = await argon2.hash(password as string);

        const user = await prisma.user.create({
            data: {
                email: email as string,
                passHash: hash,
                name: "ffooo",
                region: region as Region,
                gender: "MALE"
            }
        });

        return { success: true, message: "success" }
    }
} satisfies Actions
