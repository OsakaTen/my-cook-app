/*
  Warnings:

  - You are about to drop the column `fridgeId` on the `FoodItem` table. All the data in the column will be lost.
  - You are about to drop the `Fridge` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `FoodItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."FoodItem" DROP CONSTRAINT "FoodItem_fridgeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Fridge" DROP CONSTRAINT "Fridge_userId_fkey";

-- AlterTable
ALTER TABLE "public"."FoodItem" DROP COLUMN "fridgeId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Fridge";

-- AddForeignKey
ALTER TABLE "public"."FoodItem" ADD CONSTRAINT "FoodItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
