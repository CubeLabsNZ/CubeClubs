import type { Actions } from "./$types";
import { fail } from "@sveltejs/kit";

import { randomBytes } from "crypto";

import prisma from "$lib/prisma";

import argon2 from "argon2";
import { redirect } from "@sveltejs/kit";

import crypto from 'crypto'
import { db } from "$lib/db";

export const actions = {
    default: async ({ request, getClientAddress, cookies }) =>  {
        const data = await request.formData();

        const user_id = Number(data.get("user_id"));

        const currentPassword = data.get("current");

        const newPassword = data.get("new");
        const confirmPassword = data.get("confirm");


        // INFO: this should never fail
        const user = await prisma.user.findUnique({
            where: {
                id: user_id
            }
        })

        const ispbkdf = user.pass_hash.startsWith("pbkdf2")
        let passIsCorrect

        if (ispbkdf) {
            const [algorithm, iterations, salt, hash] = user.pass_hash.split('$');
            const hashcheck = crypto.pbkdf2Sync(currentPassword as string, Buffer.from(salt), Number(iterations), 32, 'sha256').toString('base64');
            passIsCorrect = hash == hashcheck

        } else {
            passIsCorrect = await argon2.verify(user.pass_hash, currentPassword as string);
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
                id: user_id
            },
            data: {
                pass_hash: await argon2.hash(newPassword as string)
            }
        })

        await db.deleteFrom('session')
            .where('user_id', '=', user_id)
            .execute()

        cookies.delete("sessionId", {path: '/'});

        console.log("logged out")

        redirect(303, "/login");
    }
} satisfies Actions


