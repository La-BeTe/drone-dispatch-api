import { IsArray, ArrayNotEmpty, ArrayUnique, IsUUID } from 'class-validator';

export class LoadDroneDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  medicationIds: string[];
}
