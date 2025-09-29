/*
  Warnings:

  - The values [飲料] on the enum `FoodCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `tags` on the `FoodItem` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `FoodItem` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Fridge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."FoodCategory_new" AS ENUM ('野菜', '果物', '肉', '魚', '乳製品', '調味料', 'その他');
ALTER TABLE "public"."FoodItem" ALTER COLUMN "category" TYPE "public"."FoodCategory_new" USING ("category"::text::"public"."FoodCategory_new");
ALTER TYPE "public"."FoodCategory" RENAME TO "FoodCategory_old";
ALTER TYPE "public"."FoodCategory_new" RENAME TO "FoodCategory";
DROP TYPE "public"."FoodCategory_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."FoodItem" DROP CONSTRAINT "FoodItem_userId_fkey";

-- AlterTable
ALTER TABLE "public"."FoodItem" DROP COLUMN "tags",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."Fridge" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Fridge" ADD CONSTRAINT "Fridge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
