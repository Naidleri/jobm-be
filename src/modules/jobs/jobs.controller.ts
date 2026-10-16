import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard.js';
import { ApplyJobDto } from './dto/apply-job.dto.js';
import { JobsService } from './jobs.service.js';

@Controller()
export class JobsController {
  constructor(private readonly service: JobsService) {}

  @Get('jobs')
  @UseGuards(OptionalJwtAuthGuard)
  list(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 10,
    @Query('keyword') keyword?: string,
    @Query('location') location?: string,
    @Query('jobType') jobType?: string,
    @Query('minSalary', new ParseIntPipe({ optional: true })) minSalary?: number,
    @Query('maxSalary', new ParseIntPipe({ optional: true })) maxSalary?: number,
  ) {
    return this.service.list(page, pageSize, { keyword, location, jobType, minSalary, maxSalary }, user?.sub);
  }

  @Get('jobs/:jobId')
  @UseGuards(OptionalJwtAuthGuard)
  detail(@Param('jobId') jobId: string, @CurrentUser() user: AuthenticatedUser | undefined) {
    return this.service.detail(jobId, user?.sub);
  }

  @Post('jobs/:jobId/applications')
  @UseGuards(JwtAuthGuard)
  apply(
    @Param('jobId') jobId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ApplyJobDto,
  ) {
    return this.service.apply(jobId, user.sub, user.role, dto);
  }

  @Get('me/applications')
  @UseGuards(JwtAuthGuard)
  myApplications(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 10,
    @Query('status', new ParseEnumPipe(ApplicationStatus, { optional: true }))
    status?: ApplicationStatus,
  ) {
    return this.service.myApplications(user.sub, user.role, page, pageSize, status);
  }

  @Get('applications/:applicationId/history')
  @UseGuards(JwtAuthGuard)
  history(
    @Param('applicationId') applicationId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.history(applicationId, user.sub, user.role);
  }
}
