import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { DroneState } from '../drone.entity';

export class UpdateDroneDto {
	@IsOptional()
	@IsIn([DroneState.DELIVERED, DroneState.DELIVERING, 'returned'])
	@ApiPropertyOptional({
		description: 'Drone state update',
		enum: [DroneState.DELIVERED, DroneState.DELIVERING, 'returned'],
	})
	@Transform(({ value }) => value.toLowerCase())
	state?: DroneState | 'returned';

	@Min(0)
	@Max(100)
	@IsNumber()
	@IsOptional()
	@ApiPropertyOptional({
		minimum: 0,
		maximum: 100,
		description: 'New battery capacity (0-100%)',
	})
	batteryCapacity?: number;
}
