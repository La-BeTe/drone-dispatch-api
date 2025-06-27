import { IsEnum, IsOptional } from 'class-validator';
import { DroneModel, DroneState } from '../drone.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindDroneDto {
  @IsOptional()
  @IsEnum(DroneState, {
    message: 'state must be a valid DroneState or "available"',
  })
  @ApiPropertyOptional({
    enum: DroneState,
    description: 'Drone state or "available"',
  })
  state?: DroneState | 'available';

  @IsOptional()
  @IsEnum(DroneModel)
  @ApiPropertyOptional({ enum: DroneModel, description: 'Drone model' })
  model?: DroneModel;
}
