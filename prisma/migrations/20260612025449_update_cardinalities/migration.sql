/*
  Warnings:

  - You are about to drop the `HouseResident` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `ownerId` on table `House` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('STANDARD', 'DEVELOPER', 'BANK');

-- CreateEnum
CREATE TYPE "ResidentRole" AS ENUM ('MAIN_RESIDENT', 'FAMILY_MEMBER');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('SELF', 'SPOUSE', 'CHILD', 'PARENT', 'SIBLING', 'OTHER');

-- DropForeignKey
ALTER TABLE "House" DROP CONSTRAINT "House_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "HouseResident" DROP CONSTRAINT "HouseResident_houseId_fkey";

-- DropForeignKey
ALTER TABLE "HouseResident" DROP CONSTRAINT "HouseResident_userId_fkey";

-- AlterTable (Set defaults first, leave ownerId loose for now)
ALTER TABLE "House" ALTER COLUMN "status" SET DEFAULT 'VACANT';
ALTER TABLE "MonthlyDues" ALTER COLUMN "status" SET DEFAULT 'UNPAID';
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'FAILED';

-- 1. Create the new users table first so it exists for data insertions
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" VARCHAR(500),
    "phoneNumber" VARCHAR(20) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "userType" "UserType" NOT NULL DEFAULT 'STANDARD',
    "identificationNumber" TEXT,
    "kkUrl" VARCHAR(500),
    "ktpUrl" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- 2. Pipe data from old legacy "User" table directly into new "users" table
INSERT INTO "users" (
    "id", "name", "email", "phoneNumber", "role", "userType", 
    "identificationNumber", "kkUrl", "ktpUrl", "createdAt", "updatedAt"
)
SELECT 
    "id", "name", CONCAT(LOWER(REPLACE("name", ' ', '')), '@example.com'), "phoneNumber", "role", 'STANDARD',
    "identificationNumber", "kkUrl", "ktpUrl", "createdAt", "updatedAt"
FROM "User";

-- 3. Insert system backup developer record for any ownership anomalies
INSERT INTO "users" ("id", "name", "email", "phoneNumber", "role", "userType", "createdAt", "updatedAt")
VALUES ('system-developer-uuid', 'Default Developer', 'developer@example.com', '0000000000', 'ADMIN', 'DEVELOPER', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 4. Clean up any existing orphaned house ownership gaps safely
UPDATE "House" SET "ownerId" = 'system-developer-uuid' WHERE "ownerId" IS NULL;

-- 5. Now that all data values match integrity checks, apply the NOT NULL rule safely
ALTER TABLE "House" ALTER COLUMN "ownerId" SET NOT NULL;

-- CreateTable Better-Auth Sessions
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable Better-Auth Accounts
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable Better-Auth Verifications
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable Residents
CREATE TABLE "Resident" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "houseId" TEXT NOT NULL,
    "parentResidentId" TEXT,
    "residentRole" "ResidentRole" NOT NULL DEFAULT 'FAMILY_MEMBER',
    "relationship" "RelationshipType" NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resident_pkey" PRIMARY KEY ("id")
);

-- 6. Hydrate Resident tracking schema from previous mapping layer records
INSERT INTO "Resident" (
    "id", "userId", "houseId", "residentRole", "relationship", "createdAt", "updatedAt"
)
SELECT 
    "id", "userId", "houseId", 'MAIN_RESIDENT', 'SELF', "createdAt", "updatedAt"
FROM "HouseResident";

-- Constraints & Performance Indices
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");
CREATE UNIQUE INDEX "users_identificationNumber_key" ON "users"("identificationNumber");
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");
CREATE UNIQUE INDEX "Resident_userId_key" ON "Resident"("userId");
CREATE INDEX "Resident_userId_idx" ON "Resident"("userId");
CREATE INDEX "Resident_houseId_idx" ON "Resident"("houseId");
CREATE INDEX "Resident_parentResidentId_idx" ON "Resident"("parentResidentId");

-- Foreign Keys Assignment
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "House" ADD CONSTRAINT "House_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_parentResidentId_fkey" FOREIGN KEY ("parentResidentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 7. Securely drop legacy dependencies
DROP TABLE "HouseResident";
DROP TABLE "User";