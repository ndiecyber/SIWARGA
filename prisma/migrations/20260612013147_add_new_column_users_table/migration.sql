/*
  Warnings:

  - A unique constraint covering the columns `[identificationNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "familyCount" INTEGER,
ADD COLUMN     "identificationNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_identificationNumber_key" ON "User"("identificationNumber");
