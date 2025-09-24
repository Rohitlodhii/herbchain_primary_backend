/*
  Warnings:

  - A unique constraint covering the columns `[farmerId]` on the table `Farmer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `farmerId` to the `Farmer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Farmer" ADD COLUMN     "farmerId" TEXT NOT NULL,
ALTER COLUMN "fullName" DROP NOT NULL,
ALTER COLUMN "dob" DROP NOT NULL,
ALTER COLUMN "aadhaarNumber" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."LandInfo" ALTER COLUMN "totalHectare" DROP NOT NULL,
ALTER COLUMN "khasraNumber" DROP NOT NULL,
ALTER COLUMN "coordinates" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."OTP" (
    "id" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_farmerId_key" ON "public"."Farmer"("farmerId");
