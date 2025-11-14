/*
  Warnings:

  - You are about to drop the column `category1` on the `RecipeCategory` table. All the data in the column will be lost.
  - You are about to drop the column `category2` on the `RecipeCategory` table. All the data in the column will be lost.
  - You are about to drop the column `category3` on the `RecipeCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."RecipeCategory" DROP CONSTRAINT "RecipeCategory_parentCategoryId_fkey";

-- AlterTable
ALTER TABLE "public"."RecipeCategory" DROP COLUMN "category1",
DROP COLUMN "category2",
DROP COLUMN "category3";

-- AddForeignKey
ALTER TABLE "public"."RecipeCategory" ADD CONSTRAINT "RecipeCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "RecipeCategory"("categoryId") ON DELETE SET NULL ON UPDATE CASCADE;
