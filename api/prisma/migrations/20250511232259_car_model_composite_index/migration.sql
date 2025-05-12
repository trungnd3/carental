/*
  Warnings:

  - A unique constraint covering the columns `[brand,model]` on the table `CarModel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[licenseNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CarModel_brand_model_key" ON "CarModel"("brand", "model");

-- CreateIndex
CREATE UNIQUE INDEX "User_licenseNumber_key" ON "User"("licenseNumber");
