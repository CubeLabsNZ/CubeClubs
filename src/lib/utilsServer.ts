import { redirect, error, type Cookies } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { User } from "@prisma/client";

export async function getUserSession(cookies: Cookies): Promise<User | null | undefined> {
    const sessionId = cookies.get("sessionId");
    if (!sessionId) return null

    const sessionIdBuf = Buffer.from(sessionId, "base64url");

    const session = await prisma.session.findUnique({
        where: {
            id: sessionIdBuf
        },
        include: {
            user: true
        }
    })

    return session?.user;
}

export async function getUserSessionOrThrow(cookies: Cookies, needsAdmin: boolean): Promise<User> {
    const user = await getUserSession(cookies);

    if (!user) {
        throw redirect(303, "/login");
    }

    if (needsAdmin && !user.isClubOrganiser) {
        throw error(403, "unauthorised");
    }

    return user;
}
