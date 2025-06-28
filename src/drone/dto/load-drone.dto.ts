import { IsArray, ArrayNotEmpty, ArrayUnique, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoadDroneDto {
  @ApiProperty({ type: [String], description: 'Array of medication codes' })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  medicationCodes: string[];
}
