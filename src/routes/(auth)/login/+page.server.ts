import type { Actions } from "./$types";
import { fail } from "@sveltejs/kit";

import { randomBytes } from "crypto";

import prisma from "$lib/prisma";

import argon2 from "argon2";
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from './$types';
import { getUserSession } from '$lib/utilsServer';

import crypto from 'crypto'

export const load = (async ({ cookies }) => {
    const user = await getUserSession(cookies);
    if (user) {
        throw redirect(303, "/");
    }
}) satisfies PageServerLoad;

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


        const ispbkdf = user.pass_hash.startsWith("pbkdf2")
        let passIsCorrect
        if (ispbkdf) {
            const [algorithm, iterations, salt, hash] = user.pass_hash.split('$');
            const hashcheck = crypto.pbkdf2Sync(password as string, Buffer.from(salt), Number(iterations), 32, 'sha256').toString('base64');
            passIsCorrect = hash == hashcheck

        } else {
            passIsCorrect = await argon2.verify(user.pass_hash, password as string);
        }

        if (!passIsCorrect) { 
            return fail(401, { email, error: "pass"})
        }

        if (ispbkdf) {
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    pass_hash: await argon2.hash(password as string)
                }
            })
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
