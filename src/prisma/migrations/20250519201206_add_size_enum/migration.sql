/*
  Warnings:

  - The `status` column on the `SlotRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `size` on the `ParkingSlot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `size` on the `Vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Size" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "SlotRequest" DROP CONSTRAINT "SlotRequest_slotId_fkey";

-- AlterTable
ALTER TABLE "ParkingSlot" DROP COLUMN "size",
ADD COLUMN     "size" "Size" NOT NULL;

-- AlterTable
ALTER TABLE "SlotRequest" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "preferredLocation" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ALTER COLUMN "slotId" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "size",
ADD COLUMN     "size" "Size" NOT NULL;

-- AddForeignKey
ALTER TABLE "SlotRequest" ADD CONSTRAINT "SlotRequest_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "ParkingSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
