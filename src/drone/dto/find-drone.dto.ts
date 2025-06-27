import { IsEnum, IsOptional } from 'class-validator';
import { DroneModel, DroneState } from '../drone.entity';

export class FindDroneDto {
  @IsOptional()
  @IsEnum(DroneState, {
    message: 'state must be a valid DroneState or "available"',
  })
  state?: DroneState | 'available';

  @IsOptional()
  @IsEnum(DroneModel)
  model?: DroneModel;
}
