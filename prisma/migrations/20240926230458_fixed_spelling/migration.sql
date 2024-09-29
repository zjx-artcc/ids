/*
  Warnings:

  - You are about to drop the column `runwayIndentifier` on the `AirportRunway` table. All the data in the column will be lost.
  - Added the required column `runwayIdentifier` to the `AirportRunway` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AirportRunway" DROP COLUMN "runwayIndentifier",
ADD COLUMN     "runwayIdentifier" TEXT NOT NULL;
