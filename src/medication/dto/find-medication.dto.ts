import {
  IsString,
  MaxLength,
  Matches,
  IsNumber,
  Min,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class FindMedicationDto {
  @IsString()
  @MaxLength(100)
  @Matches(/^[A-Za-z0-9_-]+$/)
  name: string;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsString()
  @MaxLength(100)
  @Matches(/^[A-Z0-9_]+$/)
  code: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsUUID()
  droneId?: string;
}
