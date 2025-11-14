-- AlterTable
ALTER TABLE "public"."RecipeCategory" ADD COLUMN     "parentCategoryId" TEXT;

-- CreateIndex
CREATE INDEX "RecipeCategory_parentCategoryId_idx" ON "public"."RecipeCategory"("parentCategoryId");

-- AddForeignKey
ALTER TABLE "public"."RecipeCategory" ADD CONSTRAINT "RecipeCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "public"."RecipeCategory"("categoryId") ON DELETE SET NULL ON UPDATE CASCADE;
