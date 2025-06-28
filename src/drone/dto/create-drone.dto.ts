import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
} from 'class-validator';
import { DroneModel } from '../drone.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateDroneDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	@ApiProperty({ description: 'Unique serial number', maxLength: 100 })
	serialNumber: string;

	@IsEnum(DroneModel)
	@Transform(({ value }) => value.toLowerCase())
	@ApiProperty({ enum: DroneModel, description: 'Drone model' })
	model: DroneModel;

	@IsNumber()
	@Min(0)
	@Max(500)
	@ApiProperty({
		minimum: 0,
		maximum: 500,
		description: 'Weight limit in grams (max 500g)',
	})
	weightLimit: number;

	@IsNumber()
	@Min(0)
	@Max(100)
	@ApiProperty({
		minimum: 0,
		maximum: 100,
		description: 'Battery capacity (0-100%)',
	})
	batteryCapacity: number;
}
