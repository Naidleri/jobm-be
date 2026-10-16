CREATE TABLE "jobs" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT[],
    "location" TEXT NOT NULL,
    "salaryMin" INTEGER NOT NULL,
    "salaryMax" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "applicationDeadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "jobs_companyId_idx" ON "jobs"("companyId");

CREATE INDEX "jobs_status_idx" ON "jobs"("status");

CREATE INDEX "jobs_location_idx" ON "jobs"("location");

CREATE INDEX "jobs_jobType_idx" ON "jobs"("jobType");

CREATE UNIQUE INDEX "jobs_companyId_title_key" ON "jobs"("companyId", "title");

ALTER TABLE "jobs" ADD CONSTRAINT "jobs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
