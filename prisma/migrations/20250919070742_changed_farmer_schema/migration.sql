-- AlterTable
ALTER TABLE "public"."Farmer" ADD COLUMN     "isOTPverified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "farmerId" DROP NOT NULL;
