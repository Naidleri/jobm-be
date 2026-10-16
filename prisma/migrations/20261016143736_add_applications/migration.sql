CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED');

CREATE TABLE "applications" (
    "id" UUID NOT NULL,
    "jobId" UUID NOT NULL,
    "jobSeekerId" UUID NOT NULL,
    "coverLetter" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "application_history" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "fromStatus" "ApplicationStatus",
    "toStatus" "ApplicationStatus" NOT NULL,
    "changedById" UUID NOT NULL,
    "note" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_history_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "applications_status_idx" ON "applications"("status");

CREATE UNIQUE INDEX "applications_jobId_jobSeekerId_key" ON "applications"("jobId", "jobSeekerId");

CREATE INDEX "application_history_applicationId_changedAt_idx" ON "application_history"("applicationId", "changedAt");

ALTER TABLE "applications" ADD CONSTRAINT "applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "applications" ADD CONSTRAINT "applications_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "application_history" ADD CONSTRAINT "application_history_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "application_history" ADD CONSTRAINT "application_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
