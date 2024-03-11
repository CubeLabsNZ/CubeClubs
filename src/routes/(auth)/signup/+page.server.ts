import type { Actions } from "./$types";
import type { Region } from "@prisma/client";

import { fail, redirect } from "@sveltejs/kit";

import prisma from "$lib/prisma";

import argon2 from "argon2";

import type { PageServerLoad } from './$types';
import { getUserSession } from '$lib/utilsServer';

export const load = (async ({ cookies }) => {
    const user = await getUserSession(cookies);
    if (user) {
        redirect(303, "/");
    }
}) satisfies PageServerLoad;


export const actions = {
    default: async ({ request }) =>  {
        const data = await request.formData();


        const email = data.get("email");
        const password = data.get("password");
        const confirmPassword = data.get("confirmPassword");
        const region = data.get("region");
        const fullName = (data.get("fullName") as string).trim().split(" ").filter(c => c).map(s => s.length > 1 ? s[0].toUpperCase() + s.slice(1, s.length) : s[0].toUpperCase()).join(" ");


        const userExists = await prisma.user.count({
            where: {
                email: email as string
            }
        });

        if (userExists > 0) {
            return fail(409, { email, region, fullName, error: "EMAIL" });
        }


        if (password !== confirmPassword) { 
            return fail(400, { email, region, fullName, error: "PASS_MISMATCH" });
        }

        data.forEach(v => {
            console.log(v);
        })


        const hash = await argon2.hash(password as string);

        const user = await prisma.user.create({
            data: {
                email: email as string,
                pass_hash: hash,
                name: fullName as string,
                region: region as Region
            }
        });

        redirect(303, "/login");

        return { success: true, message: "success" }
    }
} satisfies Actions
