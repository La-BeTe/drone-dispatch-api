import { IsIn } from 'class-validator';
import { DroneState } from '../drone.entity';

export class UpdateDroneDto {
  @IsIn([DroneState.DELIVERED, DroneState.DELIVERING])
  state: DroneState;
}
