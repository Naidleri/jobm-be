import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'salaryRange', async: false })
class SalaryRangeConstraint implements ValidatorConstraintInterface {
  validate(salaryMax: number, args: ValidationArguments): boolean {
    const dto = args.object as CreateJobDto;
    return salaryMax >= dto.salaryMin;
  }

  defaultMessage(): string {
    return 'salaryMax harus lebih besar atau sama dengan salaryMin';
  }
}

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
  @Validate(SalaryRangeConstraint)
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
