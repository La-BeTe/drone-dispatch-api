import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drone } from './drone.entity';
import { DroneService } from './drone.service';
import { DroneController } from './drone.controller';
import { AuditLog } from './audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Drone, AuditLog])],
  providers: [DroneService],
  controllers: [DroneController],
})
export class DroneModule {}
