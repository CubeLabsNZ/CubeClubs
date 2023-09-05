import type { Actions } from "./$types";
import { fail } from "@sveltejs/kit";

import { randomBytes } from "crypto";

import prisma from "$lib/prisma";

import argon2 from "argon2";
import { redirect } from "@sveltejs/kit";

import crypto from 'crypto'

export const actions = {
    default: async ({ request, getClientAddress, cookies }) =>  {
        const data = await request.formData();

        const userId = Number(data.get("userId"));

        const currentPassword = data.get("current");

        const newPassword = data.get("new");
        const confirmPassword = data.get("confirm");


        // INFO: this should never fail
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        const ispbkdf = user.passHash.startsWith("pbkdf2")
        let passIsCorrect

        if (ispbkdf) {
            const [algorithm, iterations, salt, hash] = user.passHash.split('$');
            const hashcheck = crypto.pbkdf2Sync(currentPassword as string, Buffer.from(salt), Number(iterations), 32, 'sha256').toString('base64');
            passIsCorrect = hash == hashcheck

        } else {
            passIsCorrect = await argon2.verify(user.passHash, currentPassword as string);
        }


        if (!passIsCorrect) { 
            return fail(401, { error: "current"});
        }

        if (newPassword !== confirmPassword) {
            return fail(400, { error: "new" });
        }


        // INFO: this should never fail
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                passHash: await argon2.hash(newPassword as string)
            }
        })

        cookies.delete("sessionId");

        throw redirect(303, "/login");
    }
} satisfies Actions


