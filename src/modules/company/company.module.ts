import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CompanyController } from './company.controller.js';
import { CompanyRepository } from './company.repository.js';
import { CompanyService } from './company.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@Module({
  imports: [JwtModule.register({})],
  controllers: [CompanyController],
  providers: [CompanyRepository, CompanyService, JwtAuthGuard],
})
export class CompanyModule {}
