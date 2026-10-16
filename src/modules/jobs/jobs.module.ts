import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JobsController } from './jobs.controller.js';
import { JobsRepository } from './jobs.repository.js';
import { JobsService } from './jobs.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard.js';

@Module({
  imports: [JwtModule.register({})],
  controllers: [JobsController],
  providers: [JobsRepository, JobsService, JwtAuthGuard, OptionalJwtAuthGuard],
})
export class JobsModule {}
