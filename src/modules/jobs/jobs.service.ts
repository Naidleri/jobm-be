import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus, Prisma } from '@prisma/client';
import { JobsRepository } from './jobs.repository.js';
import { ApplyJobDto } from './dto/apply-job.dto.js';

@Injectable()
export class JobsService {
  constructor(private readonly repository: JobsRepository) {}

  async list(
    page: number,
    pageSize: number,
    filters: {
      keyword?: string;
      location?: string;
      jobType?: string;
      minSalary?: number;
      maxSalary?: number;
    },
    userId?: string,
  ) {
    const where: Prisma.JobWhereInput = {
      status: 'OPEN',
      ...(filters.keyword
        ? {
            OR: [
              { title: { contains: filters.keyword, mode: 'insensitive' } },
              { description: { contains: filters.keyword, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(filters.location
        ? { location: { contains: filters.location, mode: 'insensitive' } }
        : {}),
      ...(filters.jobType ? { jobType: filters.jobType } : {}),
      ...(filters.minSalary !== undefined ? { salaryMax: { gte: filters.minSalary } } : {}),
      ...(filters.maxSalary !== undefined ? { salaryMin: { lte: filters.maxSalary } } : {}),
    };
    const [jobs, total] = await this.repository.list(
      where,
      (page - 1) * pageSize,
      pageSize,
      userId,
    );
    return {
      data: jobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company.user.name,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        currency: job.currency,
        jobType: job.jobType,
        hasApplied: job.applications.length > 0,
      })),
      total,
      page,
      pageSize,
    };
  }

  async detail(jobId: string, userId?: string) {
    const job = await this.repository.findById(jobId, userId);
    if (!job) throw new NotFoundException('Job not found');
    return {
      id: job.id,
      title: job.title,
      company: job.company.user.name,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      currency: job.currency,
      jobType: job.jobType,
      status: job.status,
      hasApplied: job.applications.length > 0,
    };
  }

  async apply(jobId: string, userId: string, role: string, dto: ApplyJobDto) {
    if (role !== 'JOB_SEEKER') {
      throw new ForbiddenException('Job seeker account required');
    }
    const job = await this.repository.findById(jobId);
    if (!job) throw new NotFoundException('Job not found');
    const existing = await this.repository.findApplication(jobId, userId);
    if (existing) throw new ConflictException('You have already applied to this job');
    try {
      const application = await this.repository.createApplication(
        jobId,
        userId,
        dto.coverLetter.trim(),
      );
      return {
        id: application.id,
        jobId: application.jobId,
        status: application.status,
        appliedAt: application.appliedAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('You have already applied to this job');
      }
      throw error;
    }
  }

  async myApplications(
    userId: string,
    role: string,
    page: number,
    pageSize: number,
    status?: ApplicationStatus,
  ) {
    if (role !== 'JOB_SEEKER') {
      throw new ForbiddenException('Job seeker account required');
    }
    const [applications, total] = await this.repository.listMyApplications(
      userId,
      (page - 1) * pageSize,
      pageSize,
      status,
    );
    return {
      data: applications.map((application) => ({
        applicationId: application.id,
        jobId: application.jobId,
        jobTitle: application.job.title,
        company: application.job.company.user.name,
        status: application.status,
        appliedAt: application.appliedAt,
      })),
      total,
      page,
      pageSize,
    };
  }

  async history(applicationId: string, userId: string, role: string) {
    if (role !== 'JOB_SEEKER') {
      throw new ForbiddenException('Job seeker account required');
    }
    const application = await this.repository.findApplicationForSeeker(
      applicationId,
      userId,
    );
    if (!application) throw new NotFoundException('Application not found');
    return {
      data: application.history.map((event) => ({
        id: event.id,
        fromStatus: event.fromStatus,
        toStatus: event.toStatus,
        changedBy: event.changedById,
        note: event.note,
        changedAt: event.changedAt,
      })),
    };
  }
}
