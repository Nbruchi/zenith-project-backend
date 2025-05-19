/*
  Warnings:

  - The values [EXTRA_LARGE] on the enum `Size` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `ParkingSlot` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SlotStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED');

-- AlterEnum
BEGIN;
CREATE TYPE "Size_new" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');
ALTER TABLE "Vehicle" ALTER COLUMN "size" TYPE "Size_new" USING ("size"::text::"Size_new");
ALTER TABLE "ParkingSlot" ALTER COLUMN "size" TYPE "Size_new" USING ("size"::text::"Size_new");
ALTER TYPE "Size" RENAME TO "Size_old";
ALTER TYPE "Size_new" RENAME TO "Size";
DROP TYPE "Size_old";
COMMIT;

-- AlterTable
ALTER TABLE "ParkingSlot" DROP COLUMN "status",
ADD COLUMN     "status" "SlotStatus" NOT NULL DEFAULT 'AVAILABLE';
