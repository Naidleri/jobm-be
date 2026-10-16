import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  findCompanyByUserId(userId: string) {
    return this.prisma.company.findUnique({ where: { userId } });
  }

  createJob(companyId: string, data: Record<string, unknown>) {
    return this.prisma.job.create({ data: { ...data, companyId } as never });
  }

  listJobs(companyId: string, skip: number, take: number, status?: string) {
    return Promise.all([
      this.prisma.job.findMany({
        where: { companyId, ...(status ? { status } : {}) },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.job.count({ where: { companyId, ...(status ? { status } : {}) } }),
    ]);
  }

  listCandidates(jobId: string, companyId: string, skip: number, take: number, status?: ApplicationStatus) {
    return this.prisma.application.findMany({
      where: { jobId, job: { companyId }, ...(status ? { status } : {}) },
      skip,
      take,
      include: { jobSeeker: true },
      orderBy: { appliedAt: 'desc' },
    });
  }

  countCandidates(jobId: string, companyId: string, status?: ApplicationStatus) {
    return this.prisma.application.count({
      where: { jobId, job: { companyId }, ...(status ? { status } : {}) },
    });
  }

  findApplication(applicationId: string, companyId: string) {
    return this.prisma.application.findFirst({
      where: { id: applicationId, job: { companyId } },
    });
  }

  updateApplication(
    applicationId: string,
    fromStatus: ApplicationStatus,
    status: ApplicationStatus,
    changedById: string,
    note?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const application = await tx.application.update({
        where: { id: applicationId },
        data: { status },
      });
      await tx.applicationHistory.create({
        data: { applicationId, fromStatus, toStatus: status, changedById, note },
      });
      return application;
    });
  }
}
