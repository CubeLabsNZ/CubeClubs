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


        const ispbkdf = user.passHash.startsWith("$pbkdf2")
        let passIsCorrect
        if (ispbkdf) {
            const parts = user.passHash.split('$')
            passIsCorrect = parts[4] == crypto.pbkdf2Sync(password as string, Buffer.from(parts[3].replace(/\./g, '+') + '='.repeat(parts[3].length % 3), 'base64'),
                +parts[2], 32, parts[1].split('-')[1]).toString('base64').replace(/=/g, '').replace(/\+/g, '.')
        } else {
            passIsCorrect = await argon2.verify(user.passHash, password as string);
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
                    passHash: await argon2.hash(password as string)
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
