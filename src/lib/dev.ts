import prisma from "$lib/prisma";

export async function generateClubs() {
    await prisma.club.createMany({
        data: [
            { name: "Auckland Speedcubing Club" },
            { name: "Christchurch Speedcubers" },
            { name: "Kāpiti Cubers" },
            { name: "Dunedin Speedcubers"},
            { name: "Taranaki Cubers"},
            { name: "Manawatū Cubers"},
        ]
    })
}
