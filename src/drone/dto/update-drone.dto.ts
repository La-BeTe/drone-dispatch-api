import { IsEnum } from 'class-validator';
import { DroneState } from '../drone.entity';

export class UpdateDroneDto {
  @IsEnum(DroneState)
  state: DroneState;
}
