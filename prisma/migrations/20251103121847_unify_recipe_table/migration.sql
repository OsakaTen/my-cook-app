/*
  Warnings:

  - You are about to drop the column `rakutenRecipeId` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `rakutenRecipeUrl` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the `RecipeView` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."RecipeSource" AS ENUM ('USER', 'RAKUTEN');

-- DropForeignKey
ALTER TABLE "public"."RecipeView" DROP CONSTRAINT "RecipeView_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RecipeView" DROP CONSTRAINT "RecipeView_userId_fkey";

-- DropIndex
DROP INDEX "public"."Recipe_rakutenRecipeId_idx";

-- DropIndex
DROP INDEX "public"."Recipe_rakutenRecipeId_key";

-- AlterTable
ALTER TABLE "public"."Recipe" DROP COLUMN "rakutenRecipeId",
DROP COLUMN "rakutenRecipeUrl",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "categoryName" TEXT,
ADD COLUMN     "cost" TEXT,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "externalUrl" TEXT,
ADD COLUMN     "source" "public"."RecipeSource" NOT NULL DEFAULT 'USER',
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "cookingTime" DROP NOT NULL,
ALTER COLUMN "difficulty" DROP NOT NULL,
ALTER COLUMN "servings" DROP NOT NULL,
ALTER COLUMN "instructions" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."RecipeView";

-- CreateTable
CREATE TABLE "public"."RecipeCategory" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "category1" TEXT NOT NULL,
    "category2" TEXT,
    "category3" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeCategory_categoryId_key" ON "public"."RecipeCategory"("categoryId");

-- CreateIndex
CREATE INDEX "RecipeCategory_categoryName_idx" ON "public"."RecipeCategory"("categoryName");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_externalId_key" ON "public"."Recipe"("externalId");

-- CreateIndex
CREATE INDEX "Recipe_externalId_idx" ON "public"."Recipe"("externalId");

-- CreateIndex
CREATE INDEX "Recipe_categoryName_idx" ON "public"."Recipe"("categoryName");

-- CreateIndex
CREATE INDEX "Recipe_source_idx" ON "public"."Recipe"("source");
