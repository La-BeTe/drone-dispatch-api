import {
  IsEnum,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { DroneModel } from '../drone.entity';

export class CreateDroneDto {
  @IsString()
  @MaxLength(100)
  serialNumber: string;

  @IsEnum(DroneModel)
  model: DroneModel;

  @IsNumber()
  @Max(500)
  weightLimit: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  batteryCapacity: number;
}
