import {
  IsEnum,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { DroneModel } from '../drone.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDroneDto {
  @IsString()
  @MaxLength(100)
  @ApiProperty({ description: 'Unique serial number', maxLength: 100 })
  serialNumber: string;

  @IsEnum(DroneModel)
  @ApiProperty({ enum: DroneModel, description: 'Drone model' })
  model: DroneModel;

  @IsNumber()
  @Max(500)
  @ApiProperty({ description: 'Weight limit (max 500g)', maximum: 500 })
  weightLimit: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({
    description: 'Battery capacity (0-100%)',
    minimum: 0,
    maximum: 100,
  })
  batteryCapacity: number;
}
