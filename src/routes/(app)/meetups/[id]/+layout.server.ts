import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { populateRounds, getMeetupPuzzles } from '$lib/utilsServer';
import { db } from '$lib/db';
import { sql } from 'kysely';

export const load = (async ({ params }) => {
    const id = Number(params.id)

    if (isNaN(id)) {
        throw error(404, 'not found');
    }

    const meetup = await db.selectFrom('meetup')
        .where('meetup.id', '=', id)
        //.leftJoin('organiser_in_meetup', 'organiser_in_meetup.meetup_id', 'meetup.id')
        //.leftJoin('user as organiser', 'organiser_in_meetup.user_id', 'organiser.id')
        //.leftJoin('user_in_meetup', 'user_in_meetup.meetup_id', 'meetup.id')
        //.leftJoin('user as competitor', 'user_in_meetup.user_id', 'competitor.id')
        .innerJoin('club', 'club.id', 'meetup.club_id')
        .leftJoinLateral(
            (eb) =>
                eb.selectFrom('user as organiser')
                    .innerJoin('organiser_in_meetup', 'organiser_in_meetup.user_id', 'organiser.id')
                    .whereRef('organiser_in_meetup.meetup_id', '=', 'meetup.id')
                    .select(eb => eb.fn.agg('json_agg', [eb.fn.agg('json_build_object', [sql<string>`'name'`, 'organiser.name', sql`'id'`, 'organiser.id'])]).as("organisers"))
                    .as('organisers'), join => join.onTrue()
        )
        .leftJoinLateral(
            (eb) =>
                eb.selectFrom('user as competitor')
                    .innerJoin('user_in_meetup', 'user_in_meetup.user_id', 'competitor.id')
                    .whereRef('user_in_meetup.meetup_id', '=', 'meetup.id')
                    .select(eb => eb.fn.agg('json_agg', [eb.fn.agg('json_build_object', [
                        sql`'name'`, 'competitor.name',
                        sql`'id'`, 'competitor.id',
                        sql`'registered_events'`, 'registered_events'
                    ])]).as("competitors"))
                    .as('competitors'), join => join.onTrue()
        )
        .leftJoinLateral(
            (eb) =>
                eb.selectFrom('round')
                    .innerJoinLateral(eb => eb
                        .selectFrom('round as round_inner')
                        .select(eb => [
                            eb.fn.count('round_inner.id').as('round_maximum'),
                            eb(eb.fn.count('round_inner.id').filterWhereRef('round_inner.start_date', '<', 'round.start_date'), '+', eb.lit(1)).as('round_number')
                        ])
                        .whereRef('round_inner.meetup_id', '=', 'meetup.id')
                        .whereRef('round_inner.puzzle', '=', 'round.puzzle')
                        .as('counts'), join => join.onTrue())
                    .whereRef('round.meetup_id', '=', 'meetup.id')
                    .select(eb => [
                        sql`json_agg(json_build_object('puzzle', "round"."puzzle", 'start_date', "round"."start_date", 'end_date', "round"."end_date", 'round_number', "counts"."round_number", 'round_maximum', "counts"."round_maximum") ORDER BY "round"."start_date" ASC)`.as("rounds"),
                        eb.fn.agg('json_agg', ['round.puzzle']).distinct().as('puzzles')])
                    .as('rounds'), join => join.onTrue()
        )
        .select(eb => [
            'meetup.name',
            'meetup.date',
            'meetup.venue',
            'meetup.location',
            'meetup.competitor_limit',
            'meetup.description',
            'meetup.external_registration_link',
            'meetup.external_registration_link',
            'meetup.registration_information',
            'organisers.organisers',
            'competitors.competitors',
            'rounds.rounds',
            'rounds.puzzles',
            'meetup.is_published',
            'club.name as club_name',
        ])
        .executeTakeFirst()


    // TODO: check admin, can view "public page" in dashboard -> to here.
    if (!meetup || !meetup.is_published) {
        throw error(404, 'not found');
    }

    return {
        meetup,
        puzzles: meetup.puzzles,
        slug: params.id
    }
}) satisfies LayoutServerLoad
