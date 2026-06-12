-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "HouseStatus" AS ENUM ('OCCUPIED', 'VACANT');

-- CreateEnum
CREATE TYPE "MonthlyDuesStatus" AS ENUM ('PAID', 'UNPAID');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "role" "Role" NOT NULL,
    "KK_URL" VARCHAR(500) NOT NULL,
    "KTP_URL" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "House" (
    "id" TEXT NOT NULL,
    "house_number" VARCHAR(50) NOT NULL,
    "block" VARCHAR(10) NOT NULL,
    "status" "HouseStatus" NOT NULL,
    "owner_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "House_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HouseResident" (
    "id" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_house" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HouseResident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyDues" (
    "id" TEXT NOT NULL,
    "house_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "due_date" DATE NOT NULL,
    "status" "MonthlyDuesStatus" NOT NULL,
    "payment_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyDues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount_paid" DECIMAL(15,2) NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_method" VARCHAR(50) NOT NULL,
    "proof_url" VARCHAR(500),
    "status" "PaymentStatus" NOT NULL,
    "verified_by" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- CreateIndex
CREATE INDEX "House_owner_id_idx" ON "House"("owner_id");

-- CreateIndex
CREATE INDEX "HouseResident_id_user_idx" ON "HouseResident"("id_user");

-- CreateIndex
CREATE INDEX "HouseResident_id_house_idx" ON "HouseResident"("id_house");

-- CreateIndex
CREATE UNIQUE INDEX "HouseResident_id_user_id_house_key" ON "HouseResident"("id_user", "id_house");

-- CreateIndex
CREATE INDEX "MonthlyDues_house_id_idx" ON "MonthlyDues"("house_id");

-- CreateIndex
CREATE INDEX "MonthlyDues_payment_id_idx" ON "MonthlyDues"("payment_id");

-- CreateIndex
CREATE INDEX "MonthlyDues_status_idx" ON "MonthlyDues"("status");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyDues_house_id_month_year_key" ON "MonthlyDues"("house_id", "month", "year");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_paid_at_idx" ON "Payment"("paid_at");

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseResident" ADD CONSTRAINT "HouseResident_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseResident" ADD CONSTRAINT "HouseResident_id_house_fkey" FOREIGN KEY ("id_house") REFERENCES "House"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyDues" ADD CONSTRAINT "MonthlyDues_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "House"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyDues" ADD CONSTRAINT "MonthlyDues_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
