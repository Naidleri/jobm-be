import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CompanyService } from './company.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Post('jobs')
  createJob(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateJobDto) {
    return this.service.createJob(user.sub, dto);
  }

  @Get('jobs')
  listJobs(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 10,
    @Query('status') status?: string,
  ) {
    return this.service.listJobs(user.sub, page, pageSize, status);
  }

  @Get('jobs/:jobId/applications')
  listCandidates(
    @CurrentUser() user: AuthenticatedUser,
    @Param('jobId') jobId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 10,
    @Query('status', new ParseEnumPipe(ApplicationStatus, { optional: true }))
    status?: ApplicationStatus,
  ) {
    return this.service.listCandidates(user.sub, jobId, page, pageSize, status);
  }

  @Patch('applications/:applicationId/status')
  updateApplication(
    @CurrentUser() user: AuthenticatedUser,
    @Param('applicationId') applicationId: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.service.updateApplication(user.sub, applicationId, dto);
  }
}
