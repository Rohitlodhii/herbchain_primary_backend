-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('INCOME_CERTIFICATE', 'FARMER_PHOTOGRAPH', 'LAND_CERTIFICATE');

-- CreateTable
CREATE TABLE "public"."Farmer" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "aadhaarNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Farmer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LandInfo" (
    "id" TEXT NOT NULL,
    "totalHectare" DOUBLE PRECISION NOT NULL,
    "khasraNumber" TEXT NOT NULL,
    "coordinates" JSONB NOT NULL,
    "farmerId" TEXT NOT NULL,

    CONSTRAINT "LandInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Document" (
    "id" TEXT NOT NULL,
    "type" "public"."DocumentType" NOT NULL,
    "url" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Crop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,

    CONSTRAINT "Crop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_mobileNumber_key" ON "public"."Farmer"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_aadhaarNumber_key" ON "public"."Farmer"("aadhaarNumber");

-- CreateIndex
CREATE UNIQUE INDEX "LandInfo_farmerId_key" ON "public"."LandInfo"("farmerId");

-- AddForeignKey
ALTER TABLE "public"."LandInfo" ADD CONSTRAINT "LandInfo_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "public"."Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "public"."Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Crop" ADD CONSTRAINT "Crop_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "public"."Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
