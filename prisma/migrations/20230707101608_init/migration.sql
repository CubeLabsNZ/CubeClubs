-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Puzzle" AS ENUM ('TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'THREEBLD', 'FOURBLD', 'FIVEBLD', 'MULTIBLD', 'SQ1', 'PYRAMINX', 'MEGAMINX', 'SKEWB', 'CLOCK', 'THREEOH', 'LUNCH');

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
    "clubId" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "isClubOrganiser" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInCompetition" (
    "userId" INTEGER NOT NULL,
    "competitionId" INTEGER NOT NULL,
    "registeredEvents" "Puzzle"[],

    CONSTRAINT "UserInCompetition_pkey" PRIMARY KEY ("userId","competitionId")
);

-- CreateTable
CREATE TABLE "Competition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "competitorLimit" INTEGER NOT NULL,
    "events" "Puzzle"[],

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleItem" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "activity" "Puzzle",
    "round" INTEGER NOT NULL,
    "format" "Format" NOT NULL,
    "competitionId" INTEGER,

    CONSTRAINT "ScheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompetitionToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_CompetitionToUser_AB_unique" ON "_CompetitionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetitionToUser_B_index" ON "_CompetitionToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInCompetition" ADD CONSTRAINT "UserInCompetition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInCompetition" ADD CONSTRAINT "UserInCompetition_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleItem" ADD CONSTRAINT "ScheduleItem_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionToUser" ADD CONSTRAINT "_CompetitionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionToUser" ADD CONSTRAINT "_CompetitionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
