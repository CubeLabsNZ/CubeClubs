-- CreateEnum
CREATE TYPE "Region" AS ENUM ('NORTHLAND', 'AUCKLAND', 'WAIKATO', 'BOP', 'GISBORNE', 'HAWKES_BAY', 'TARANAKI', 'MANAWATU_WHANGANUI', 'WELLINGTON', 'TASMAN', 'NELSON', 'MARLBOROUGH', 'WEST_COAST', 'CANTERBURY', 'OTAGO', 'SOUTHLAND', 'VISITOR');

-- CreateEnum
CREATE TYPE "Puzzle" AS ENUM ('THREE', 'TWO', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'SQ1', 'SKEWB', 'PYRA', 'MEGA', 'OH', 'CLOCK', 'FMC', 'THREEBLD', 'MULTIBLD', 'FOURBLD', 'FIVEBLD');

-- CreateEnum
CREATE TYPE "Format" AS ENUM ('BO3', 'BO2', 'BO1', 'MO3', 'AO5');

-- CreateTable
CREATE TABLE "club" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "pass_hash" TEXT,
    "name" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "is_club_organiser" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" BYTEA NOT NULL,
    "ip" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_in_meetup" (
    "user_id" INTEGER NOT NULL,
    "meetup_id" INTEGER NOT NULL,
    "registered_events" "Puzzle"[],

    CONSTRAINT "user_in_meetup_pkey" PRIMARY KEY ("user_id","meetup_id")
);

-- CreateTable
CREATE TABLE "organiser_in_meetup" (
    "user_id" INTEGER NOT NULL,
    "meetup_id" INTEGER NOT NULL,

    CONSTRAINT "organiser_in_meetup_pkey" PRIMARY KEY ("user_id","meetup_id")
);

-- CreateTable
CREATE TABLE "meetup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "competitor_limit" INTEGER,
    "external_registration_link" TEXT,
    "registration_information" TEXT NOT NULL DEFAULT '',
    "date" DATE NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "club_id" INTEGER NOT NULL,

    CONSTRAINT "meetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "round" (
    "id" UUID NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "puzzle" "Puzzle" NOT NULL,
    "format" "Format" NOT NULL,
    "proceed_number" INTEGER NOT NULL,
    "meetup_id" INTEGER NOT NULL,

    CONSTRAINT "round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "mbld_score" INTEGER,
    "mbld_total" INTEGER,
    "user_id" INTEGER NOT NULL,
    "round_id" UUID NOT NULL,

    CONSTRAINT "result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solve" (
    "index" INTEGER NOT NULL,
    "time" DOUBLE PRECISION NOT NULL,
    "mbld_score" INTEGER,
    "mbld_total" INTEGER,
    "result_id" INTEGER NOT NULL,

    CONSTRAINT "solve_pkey" PRIMARY KEY ("result_id","index")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_in_meetup" ADD CONSTRAINT "user_in_meetup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_in_meetup" ADD CONSTRAINT "user_in_meetup_meetup_id_fkey" FOREIGN KEY ("meetup_id") REFERENCES "meetup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organiser_in_meetup" ADD CONSTRAINT "organiser_in_meetup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organiser_in_meetup" ADD CONSTRAINT "organiser_in_meetup_meetup_id_fkey" FOREIGN KEY ("meetup_id") REFERENCES "meetup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetup" ADD CONSTRAINT "meetup_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "round" ADD CONSTRAINT "round_meetup_id_fkey" FOREIGN KEY ("meetup_id") REFERENCES "meetup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solve" ADD CONSTRAINT "solve_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "result"("id") ON DELETE CASCADE ON UPDATE CASCADE;
