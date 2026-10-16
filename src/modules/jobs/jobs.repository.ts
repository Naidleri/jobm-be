import { Injectable } from '@nestjs/common';
import { ApplicationStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class JobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  list(
    where: Prisma.JobWhereInput,
    skip: number,
    take: number,
    userId?: string,
  ) {
    return Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take,
        include: {
          company: { include: { user: { select: { name: true } } } },
          applications: userId
            ? { where: { jobSeekerId: userId }, select: { id: true } }
            : false,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.job.count({ where }),
    ]);
  }

  findById(id: string, userId?: string) {
    return this.prisma.job.findUnique({
      where: { id },
      include: {
        company: { include: { user: { select: { name: true } } } },
        applications: userId
          ? { where: { jobSeekerId: userId }, select: { id: true } }
          : false,
      },
    });
  }

  findApplication(jobId: string, jobSeekerId: string) {
    return this.prisma.application.findUnique({
      where: { jobId_jobSeekerId: { jobId, jobSeekerId } },
    });
  }

  createApplication(jobId: string, jobSeekerId: string, coverLetter: string) {
    return this.prisma.application.create({
      data: { jobId, jobSeekerId, coverLetter },
    });
  }

  listMyApplications(
    jobSeekerId: string,
    skip: number,
    take: number,
    status?: ApplicationStatus,
  ) {
    const where = { jobSeekerId, ...(status ? { status } : {}) };
    return Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take,
        include: {
          job: { include: { company: { include: { user: { select: { name: true } } } } } },
        },
        orderBy: { appliedAt: 'desc' },
      }),
      this.prisma.application.count({ where }),
    ]);
  }

  findApplicationForSeeker(applicationId: string, jobSeekerId: string) {
    return this.prisma.application.findFirst({
      where: { id: applicationId, jobSeekerId },
      include: { history: { orderBy: { changedAt: 'asc' } } },
    });
  }
}
