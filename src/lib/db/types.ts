import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { Penalty, Gender, Region, Puzzle, Format } from "./enums";

export type Club = {
    id: Generated<number>;
    name: string;
};
export type Meetup = {
    id: Generated<number>;
    name: string;
    venue: string;
    location: string;
    description: string;
    contact: string;
    competitorLimit: number;
    date: Timestamp;
    isPublished: Generated<boolean>;
    clubId: number;
};
export type MeetupToUser = {
    A: number;
    B: number;
};
export type Result = {
    id: Generated<number>;
    roundId: number;
    userId: number;
};
export type Round = {
    id: Generated<number>;
    startDate: Timestamp;
    endDate: Timestamp;
    puzzle: Puzzle;
    roundNumber: number;
    format: Format;
    proceedNumber: number;
    meetupId: number;
};
export type Session = {
    id: Buffer;
    ip: string;
    userId: number;
};
export type Solve = {
    index: number;
    time: number;
    penalty: Penalty;
    resultId: number;
};
export type User = {
    id: Generated<number>;
    email: string;
    passHash: string;
    name: string;
    region: Region;
    gender: Gender;
    isClubOrganiser: Generated<boolean>;
};
export type UserInMeetup = {
    userId: number;
    meetupId: number;
    registeredEvents: Puzzle[];
};
export type DB = {
    _MeetupToUser: MeetupToUser;
    Club: Club;
    Meetup: Meetup;
    Result: Result;
    Round: Round;
    Session: Session;
    Solve: Solve;
    User: User;
    UserInMeetup: UserInMeetup;
};
