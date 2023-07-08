/*
  Warnings:

  - You are about to drop the column `clubId` on the `User` table. All the data in the column will be lost.
  - Added the required column `clubId` to the `Competition` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Region" AS ENUM ('NORTHLAND', 'AUCKLAND', 'WAIKATO', 'BOP', 'GISBORNE', 'HAWKES_BAY', 'TARANAKI', 'MANGAWATU_WHANGANUI', 'WELLINGTON', 'TASMAN', 'NELSON', 'MALBOROUGH', 'WEST_COAST', 'CANTERBURY', 'OTAGO', 'SOUTHLAND');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clubId_fkey";

-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "clubId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clubId";

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
