import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drone } from './drone.entity';
import { DroneService } from './drone.service';
import { DroneController } from './drone.controller';
import { AuditLog } from './audit-log.entity';
import { MedicationModule } from '../medication/medication.module';

@Module({
  imports: [TypeOrmModule.forFeature([Drone, AuditLog]), MedicationModule],
  providers: [DroneService],
  controllers: [DroneController],
})
export class DroneModule {}
