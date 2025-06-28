import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional, IsInt, Min, Max } from 'class-validator';
import { DroneModel, DroneState } from '../drone.entity';

export class FindDroneDto {
	@IsOptional()
	@IsIn([...Object.values(DroneState), 'available'], {
		message: 'state must be a valid DroneState or "available"',
	})
	@ApiPropertyOptional({
		description: 'Drone state or "available"',
		enum: [...Object.values(DroneState), 'available'],
	})
	@Transform(({ value }) => value.toLowerCase())
	state?: DroneState | 'available';

	@IsOptional()
	@IsEnum(DroneModel)
	@Transform(({ value }) => value.toLowerCase())
	@ApiPropertyOptional({ enum: DroneModel, description: 'Drone model' })
	model?: DroneModel;

	@Min(1)
	@IsInt()
	@IsOptional()
	@Type(() => Number)
	@ApiPropertyOptional({
		description: 'Page number (starts from 1)',
		minimum: 1,
		default: 1,
	})
	page?: number = 1;

	@Min(1)
	@IsInt()
	@Max(100)
	@IsOptional()
	@Type(() => Number)
	@ApiPropertyOptional({
		minimum: 1,
		default: 10,
		maximum: 100,
		description: 'Number of items per page',
	})
	limit?: number = 10;
}
