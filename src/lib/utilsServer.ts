import { redirect, error, type Cookies } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { Meetup, Puzzle, Round, User } from "@prisma/client";

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

    if (!user) { throw redirect(303, "/login"); }

    if (needsAdmin && !user.is_club_organiser) { throw error(403, "unauthorised"); }

    return user;
}


export function populateRounds(rounds: Round[]) {
    const roundForPuzzle = {};

    for (const round of rounds) {
        // TODO: find better way
        if (!roundForPuzzle[round.puzzle])
            roundForPuzzle[round.puzzle] = 1;
        

        round.number = roundForPuzzle[round.puzzle]
        roundForPuzzle[round.puzzle]++
    }

    const maxRounds = {};
    for (const [key, value] of Object.entries(roundForPuzzle)) {
        maxRounds[key] = value - 1;
    }

    return maxRounds;
}

export function getMeetupPuzzles(meetup: Meetup): Puzzle[] {
    return [... new Set(meetup.rounds.map((round: Round) => round.puzzle))];
}
