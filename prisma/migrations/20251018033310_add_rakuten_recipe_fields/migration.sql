/*
  Warnings:

  - A unique constraint covering the columns `[rakutenRecipeId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Recipe" ADD COLUMN     "rakutenRecipeId" TEXT,
ADD COLUMN     "rakutenRecipeUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_rakutenRecipeId_key" ON "public"."Recipe"("rakutenRecipeId");

-- CreateIndex
CREATE INDEX "Recipe_rakutenRecipeId_idx" ON "public"."Recipe"("rakutenRecipeId");
