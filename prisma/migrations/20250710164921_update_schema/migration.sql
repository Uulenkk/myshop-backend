/*
  Warnings:

  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/

-- 0. Null утгуудыг бөглөх
UPDATE "User" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;

-- 1. Order хүснэгтийн status баганыг drop хийж, enum болгож дахин үүсгэх
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'Pending';

-- 2. User хүснэгтийн updatedAt баганыг NOT NULL болгох
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;
