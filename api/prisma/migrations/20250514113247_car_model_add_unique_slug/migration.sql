/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `CarModel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CarModel_brand_model_key";

-- AlterTable
ALTER TABLE "CarModel" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "CarModel_slug_key" ON "CarModel"("slug");
