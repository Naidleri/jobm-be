/*
  Warnings:

  - The primary key for the `application_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `application_history` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "application_history" DROP CONSTRAINT "application_history_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "application_history_pkey" PRIMARY KEY ("id");
