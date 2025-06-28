import {
  IsString,
  MaxLength,
  Matches,
  IsNumber,
  Min,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMedicationDto {
  @IsString()
  @MaxLength(100)
  @Matches(/^[A-Za-z0-9_-]+$/)
  @ApiProperty({
    description: 'Medication name',
    maxLength: 100,
    pattern: '^[A-Za-z0-9_-]+$',
  })
  name: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Medication weight', minimum: 0 })
  weight: number;

  @IsString()
  @MaxLength(100)
  @Matches(/^[A-Z0-9_]+$/)
  @ApiProperty({
    description: 'Medication code',
    maxLength: 100,
    pattern: '^[A-Z0-9_]+$',
  })
  code: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Image URL' })
  image?: string;
}
