import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  note?: string;
}
