import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { CompanyRepository } from './company.repository.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';

@Injectable()
export class CompanyService {
  constructor(private readonly repository: CompanyRepository) {}

  private async companyId(userId: string): Promise<string> {
    const company = await this.repository.findCompanyByUserId(userId);
    if (!company) throw new ForbiddenException('Company account required');
    return company.id;
  }

  async createJob(userId: string, dto: CreateJobDto) {
    const companyId = await this.companyId(userId);
    return this.repository.createJob(companyId, {
      title: dto.title,
      description: dto.description,
      requirements: dto.requirements,
      location: dto.location,
      salaryMin: dto.salaryMin,
      salaryMax: dto.salaryMax,
      currency: dto.currency,
      jobType: dto.jobType,
      status: dto.status,
      applicationDeadline: new Date(dto.applicationDeadline),
    });
  }

  async listJobs(userId: string, page: number, pageSize: number, status?: string) {
    const companyId = await this.companyId(userId);
    const [data, total] = await this.repository.listJobs(
      companyId,
      (page - 1) * pageSize,
      pageSize,
      status,
    );
    return { data, total, page, pageSize };
  }

  async listCandidates(
    userId: string,
    jobId: string,
    page: number,
    pageSize: number,
    status?: ApplicationStatus,
  ) {
    const companyId = await this.companyId(userId);
    const [data, total] = await Promise.all([
      this.repository.listCandidates(jobId, companyId, (page - 1) * pageSize, pageSize, status),
      this.repository.countCandidates(jobId, companyId, status),
    ]);
    return {
      data: data.map((application) => ({
        applicationId: application.id,
        jobSeekerId: application.jobSeekerId,
        name: application.jobSeeker.name,
        email: application.jobSeeker.email,
        status: application.status,
        appliedAt: application.appliedAt,
      })),
      total,
      page,
      pageSize,
    };
  }

  async updateApplication(
    userId: string,
    applicationId: string,
    dto: UpdateApplicationStatusDto,
  ) {
    const companyId = await this.companyId(userId);
    const application = await this.repository.findApplication(applicationId, companyId);
    if (!application) throw new NotFoundException('Application not found');
    const updated = await this.repository.updateApplication(
      application.id,
      application.status,
      dto.status,
      userId,
      dto.note,
    );
    return {
      applicationId: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    };
  }
}
