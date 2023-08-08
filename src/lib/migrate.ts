import prisma from "$lib/prisma";

import * as clubs from "../../temp/club.json";

export function importData() {
    for (const club of clubs.default) {
        console.log(club);
    }
}
