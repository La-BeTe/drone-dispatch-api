import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationService } from './medication.service';
import { MedicationController } from './medication.controller';
import { Medication } from './medication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Medication])],
  providers: [MedicationService],
  controllers: [MedicationController],
  exports: [MedicationService],
})
export class MedicationModule {}
