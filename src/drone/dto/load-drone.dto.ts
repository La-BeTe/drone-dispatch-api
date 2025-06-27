import { IsArray, ArrayNotEmpty, ArrayUnique, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoadDroneDto {
  @ApiProperty({ type: [String], description: 'Array of medication UUIDs' })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  medicationIds: string[];
}
