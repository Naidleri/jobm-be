import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsArray()
  @IsString({ each: true })
  requirements!: string[];

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsInt()
  @Min(0)
  salaryMin!: number;

  @IsInt()
  @Min(0)
  salaryMax!: number;

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @IsString()
  @IsNotEmpty()
  jobType!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsDateString()
  applicationDeadline!: string;
}
