/*
  Warnings:

  - You are about to drop the column `house_number` on the `House` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `House` table. All the data in the column will be lost.
  - You are about to drop the column `id_house` on the `HouseResident` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `HouseResident` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `MonthlyDues` table. All the data in the column will be lost.
  - You are about to drop the column `house_id` on the `MonthlyDues` table. All the data in the column will be lost.
  - You are about to drop the column `payment_id` on the `MonthlyDues` table. All the data in the column will be lost.
  - You are about to drop the column `amount_paid` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `paid_at` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `proof_url` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `verified_by` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `KK_URL` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `KTP_URL` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,houseId]` on the table `HouseResident` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[houseId,month,year]` on the table `MonthlyDues` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `houseNumber` to the `House` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseId` to the `HouseResident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `HouseResident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `MonthlyDues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseId` to the `MonthlyDues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountPaid` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kkUrl` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ktpUrl` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "House" DROP CONSTRAINT "House_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "HouseResident" DROP CONSTRAINT "HouseResident_id_house_fkey";

-- DropForeignKey
ALTER TABLE "HouseResident" DROP CONSTRAINT "HouseResident_id_user_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyDues" DROP CONSTRAINT "MonthlyDues_house_id_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyDues" DROP CONSTRAINT "MonthlyDues_payment_id_fkey";

-- DropIndex
DROP INDEX "House_owner_id_idx";

-- DropIndex
DROP INDEX "HouseResident_id_house_idx";

-- DropIndex
DROP INDEX "HouseResident_id_user_id_house_key";

-- DropIndex
DROP INDEX "HouseResident_id_user_idx";

-- DropIndex
DROP INDEX "MonthlyDues_house_id_idx";

-- DropIndex
DROP INDEX "MonthlyDues_house_id_month_year_key";

-- DropIndex
DROP INDEX "MonthlyDues_payment_id_idx";

-- DropIndex
DROP INDEX "Payment_paid_at_idx";

-- DropIndex
DROP INDEX "User_phone_number_key";

-- AlterTable
ALTER TABLE "House" DROP COLUMN "house_number",
DROP COLUMN "owner_id",
ADD COLUMN     "houseNumber" VARCHAR(50) NOT NULL,
ADD COLUMN     "ownerId" TEXT;

-- AlterTable
ALTER TABLE "HouseResident" DROP COLUMN "id_house",
DROP COLUMN "id_user",
ADD COLUMN     "houseId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MonthlyDues" DROP COLUMN "due_date",
DROP COLUMN "house_id",
DROP COLUMN "payment_id",
ADD COLUMN     "dueDate" DATE NOT NULL,
ADD COLUMN     "houseId" TEXT NOT NULL,
ADD COLUMN     "paymentId" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amount_paid",
DROP COLUMN "paid_at",
DROP COLUMN "payment_method",
DROP COLUMN "proof_url",
DROP COLUMN "verified_by",
ADD COLUMN     "amountPaid" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paymentMethod" VARCHAR(50) NOT NULL,
ADD COLUMN     "proofUrl" VARCHAR(500),
ADD COLUMN     "verifiedBy" VARCHAR(255);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "KK_URL",
DROP COLUMN "KTP_URL",
DROP COLUMN "phone_number",
ADD COLUMN     "kkUrl" VARCHAR(500) NOT NULL,
ADD COLUMN     "ktpUrl" VARCHAR(500) NOT NULL,
ADD COLUMN     "phoneNumber" VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE INDEX "House_ownerId_idx" ON "House"("ownerId");

-- CreateIndex
CREATE INDEX "HouseResident_userId_idx" ON "HouseResident"("userId");

-- CreateIndex
CREATE INDEX "HouseResident_houseId_idx" ON "HouseResident"("houseId");

-- CreateIndex
CREATE UNIQUE INDEX "HouseResident_userId_houseId_key" ON "HouseResident"("userId", "houseId");

-- CreateIndex
CREATE INDEX "MonthlyDues_houseId_idx" ON "MonthlyDues"("houseId");

-- CreateIndex
CREATE INDEX "MonthlyDues_paymentId_idx" ON "MonthlyDues"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyDues_houseId_month_year_key" ON "MonthlyDues"("houseId", "month", "year");

-- CreateIndex
CREATE INDEX "Payment_paidAt_idx" ON "Payment"("paidAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseResident" ADD CONSTRAINT "HouseResident_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseResident" ADD CONSTRAINT "HouseResident_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyDues" ADD CONSTRAINT "MonthlyDues_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyDues" ADD CONSTRAINT "MonthlyDues_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
