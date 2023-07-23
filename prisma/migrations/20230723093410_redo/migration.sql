-- CreateEnum
CREATE TYPE "Penalty" AS ENUM ('NONE', 'PLUSTWO', 'DNF');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('NORTHLAND', 'AUCKLAND', 'WAIKATO', 'BOP', 'GISBORNE', 'HAWKES_BAY', 'TARANAKI', 'MANGAWATU_WHANGANUI', 'WELLINGTON', 'TASMAN', 'NELSON', 'MALBOROUGH', 'WEST_COAST', 'CANTERBURY', 'OTAGO', 'SOUTHLAND');

-- CreateEnum
CREATE TYPE "Puzzle" AS ENUM ('THREE', 'TWO', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'SQ1', 'SKEWB', 'PYRA', 'MEGA', 'OH', 'CLOCK', 'FMC', 'THREEBLD', 'MULTIBLD', 'FOURBLD', 'FIVEBLD');

-- CreateEnum
CREATE TYPE "Format" AS ENUM ('BO3', 'BO1', 'MO3', 'AO5');

-- CreateTable
CREATE TABLE "Club" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "gender" "Gender" NOT NULL,
    "isClubOrganiser" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInMeetup" (
    "userId" INTEGER NOT NULL,
    "meetupId" INTEGER NOT NULL,
    "registeredEvents" "Puzzle"[],

    CONSTRAINT "UserInMeetup_pkey" PRIMARY KEY ("userId","meetupId")
);

-- CreateTable
CREATE TABLE "Meetup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "competitorLimit" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "clubId" INTEGER NOT NULL,

    CONSTRAINT "Meetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "puzzle" "Puzzle" NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "format" "Format" NOT NULL,
    "proceedNumber" INTEGER NOT NULL,
    "meetupId" INTEGER NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "roundId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solve" (
    "index" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "penalty" "Penalty" NOT NULL,
    "resultId" INTEGER NOT NULL,

    CONSTRAINT "Solve_pkey" PRIMARY KEY ("resultId","index")
);

-- CreateTable
CREATE TABLE "_MeetupToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_MeetupToUser_AB_unique" ON "_MeetupToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MeetupToUser_B_index" ON "_MeetupToUser"("B");

-- AddForeignKey
ALTER TABLE "UserInMeetup" ADD CONSTRAINT "UserInMeetup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInMeetup" ADD CONSTRAINT "UserInMeetup_meetupId_fkey" FOREIGN KEY ("meetupId") REFERENCES "Meetup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meetup" ADD CONSTRAINT "Meetup_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_meetupId_fkey" FOREIGN KEY ("meetupId") REFERENCES "Meetup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solve" ADD CONSTRAINT "Solve_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetupToUser" ADD CONSTRAINT "_MeetupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Meetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetupToUser" ADD CONSTRAINT "_MeetupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
