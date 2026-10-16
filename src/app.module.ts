import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import appConfig from './config/app.config.js';
import databaseConfig from './config/database.config.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CompanyModule } from './modules/company/company.module.js';
import { JobsModule } from './modules/jobs/jobs.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().required(),
        PORT: Joi.number().port().default(3000),
        JWT_SECRET: Joi.string().min(32).required(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    CompanyModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
