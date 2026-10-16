import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyJobDto {
  @IsString()
  @IsNotEmpty()
  coverLetter!: string;
}
