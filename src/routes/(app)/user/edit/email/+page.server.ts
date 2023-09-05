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

        const currentEmail = data.get("current");
        const newEmail = data.get("new");
        const password = data.get("password");

        const user = await prisma.user.findUnique({
            where: {
                email: currentEmail as string
            }
        });

        if (!user) { 
            return fail(400, { currentEmail, error: "current" });
        }

        const newEmailUser = await prisma.user.findUnique({
            where: {
                email: newEmail as string
            }
        })

        if (newEmailUser) {
            return fail(400, { currentEmail, error: "new"});
        }



        const ispbkdf = user.passHash.startsWith("pbkdf2")
        let passIsCorrect
        if (ispbkdf) {
            const [algorithm, iterations, salt, hash] = user.passHash.split('$');
            const hashcheck = crypto.pbkdf2Sync(password as string, Buffer.from(salt), Number(iterations), 32, 'sha256').toString('base64');
            passIsCorrect = hash == hashcheck

        } else {
            passIsCorrect = await argon2.verify(user.passHash, password as string);
        }

        if (!passIsCorrect) { 
            return fail(401, { currentEmail, newEmail, error: "password"})
        }

        if (ispbkdf) {
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    passHash: await argon2.hash(password as string)
                }
            })
        }

        await prisma.user.update({
            where: {
                email: currentEmail as string
            },
            data: {
                email: newEmail as string
            }
        })

        cookies.delete("sessionId");

        throw redirect(303, "/login");
    }
} satisfies Actions

