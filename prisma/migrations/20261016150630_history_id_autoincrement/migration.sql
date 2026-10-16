ALTER TABLE "application_history" DROP CONSTRAINT "application_history_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "application_history_pkey" PRIMARY KEY ("id");
