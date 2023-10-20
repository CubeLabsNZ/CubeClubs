import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import type { meetup, round } from '@prisma/client';
import { getMeetupPuzzles } from "$lib/utilsServer";
import { db } from '$lib/db';
import { sql } from 'kysely';
import type { Puzzle } from '$lib/db/enums';

export const load = (async () => {
    const meetups = await db.with('all_meetups', eb => eb.selectFrom('meetup')
        .where('is_published', '=', true)
        .leftJoin('round', 'round.meetup_id', 'meetup.id')
        .innerJoin('club', 'club.id', 'meetup.club_id')
        .select(eb => [
            eb.fn.coalesce( eb.fn.agg<Puzzle[]>('json_agg', ['round.puzzle']).filterWhere('round.puzzle', 'is not', null).distinct(), sql`'[]'`).as('puzzles'),
            'meetup.id',
            'meetup.name',
            'club.name as club_name',
            'meetup.date'
        ])
        .orderBy('date desc')
        .groupBy(['meetup.id', 'club.name'])
    )
    .selectFrom('all_meetups')
    .select( eb => [
        //eb.fn.coalesce(eb.fn.agg('json_agg', ['all_meetups']).filterWhere('all_meetups.date', '<', new Date()), sql`'[]'`).as('past'),
        sql<{}[]>`coalesce(json_agg("all_meetups" ORDER BY date DESC) filter(where "all_meetups"."date" < ${sql.lit(new Date())}), '[]')`.as('past'),
        eb.fn.coalesce(eb.fn.agg('json_agg', ['all_meetups']).filterWhere('all_meetups.date', '=', new Date()), sql`'[]'`).as('ongoing'),
        //eb.fn.coalesce(eb.fn.agg('json_agg', ['all_meetups']).filterWhere('all_meetups.date', '>', new Date()), sql`'[]'`).as('upcoming'),
        sql<{}[]>`coalesce(json_agg("all_meetups" ORDER BY date ASC) filter(where "all_meetups"."date" > ${sql.lit(new Date())}), '[]')`.as('upcoming')
    ])
    .executeTakeFirst()
    return meetups;
}) satisfies PageServerLoad;
