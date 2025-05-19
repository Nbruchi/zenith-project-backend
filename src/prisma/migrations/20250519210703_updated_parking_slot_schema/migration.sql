/*
  Warnings:

  - You are about to drop the column `endDate` on the `SlotRequest` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `SlotRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SlotRequest" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3);
