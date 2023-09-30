import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { region, puzzle, format } from "./enums";

export type club = {
    id: Generated<number>;
    name: string;
};
export type meetup = {
    id: Generated<number>;
    name: string;
    venue: string;
    location: string;
    description: string;
    contact: string;
    competitor_limit: number | null;
    external_registration_link: string | null;
    registration_information: Generated<string>;
    date: Timestamp;
    is_published: Generated<boolean>;
    club_id: number;
};
export type organiser_in_meetup = {
    user_id: number;
    meetup_id: number;
};
export type result = {
    id: Generated<number>;
    value: number;
    mbld_score: number | null;
    mbld_total: number | null;
    user_id: number;
    round_id: string;
};
export type round = {
    id: string;
    start_date: Timestamp;
    end_date: Timestamp;
    puzzle: puzzle;
    format: format;
    proceed_number: number;
    meetup_id: number;
};
export type session = {
    id: Buffer;
    ip: string;
    user_id: number;
};
export type solve = {
    index: number;
    time: number;
    mbld_score: number | null;
    mbld_total: number | null;
    result_id: number;
};
export type user = {
    id: Generated<number>;
    email: string | null;
    pass_hash: string | null;
    name: string;
    region: region;
    is_club_organiser: Generated<boolean>;
};
export type user_in_meetup = {
    user_id: number;
    meetup_id: number;
    registered_events: puzzle[];
};
export type DB = {
    club: club;
    meetup: meetup;
    organiser_in_meetup: organiser_in_meetup;
    result: result;
    round: round;
    session: session;
    solve: solve;
    user: user;
    user_in_meetup: user_in_meetup;
};
