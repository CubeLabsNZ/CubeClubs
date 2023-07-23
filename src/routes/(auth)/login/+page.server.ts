import type { Actions } from "./$types";
import { fail } from "@sveltejs/kit";

import { randomBytes } from "crypto";

import prisma from "$lib/prisma";

import argon2 from "argon2";
import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ request, getClientAddress, cookies }) =>  {
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


        const session = await prisma.session.create({
            data: {
                id: randomBytes(32),
                ip: getClientAddress(),
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })

        // TODO: set secure?
        cookies.set("sessionId", session.id.toString("base64url"), {
            path: "/",
            httpOnly: false,
            maxAge: 60 * 60 * 24 * 7 * 4,
            secure: process.env.NODE_ENV === "production"
        });

        throw redirect(303, "/");
    }
} satisfies Actions
