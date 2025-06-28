import {
	IsString,
	MaxLength,
	Matches,
	IsNumber,
	Min,
	IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class UpdateMedicationDto {
	@IsString()
	@Optional()
	@MaxLength(100)
	@Matches(/^[A-Za-z0-9_-]+$/)
	@ApiPropertyOptional({
		description: 'Medication name',
		maxLength: 100,
		pattern: '^[A-Za-z0-9_-]+$',
	})
	name?: string;

	@Min(0)
	@IsNumber()
	@IsOptional()
	@ApiPropertyOptional({ description: 'Medication weight', minimum: 0 })
	weight?: number;

	@IsString()
	@IsOptional()
	@MaxLength(100)
	@Matches(/^[A-Z0-9_]+$/)
	@ApiPropertyOptional({
		description: 'Medication code',
		maxLength: 100,
		pattern: '^[A-Z0-9_]+$',
	})
	code?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ description: 'Image URL' })
	image?: string;
}
