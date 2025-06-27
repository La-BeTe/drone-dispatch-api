import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drone, DroneState } from './drone.entity';
import { AuditLog } from './audit-log.entity';
import { AuditEventType } from './audit-log.entity';
import { CreateDroneDto } from './dto/create-drone.dto';
import { FindDroneDto } from './dto/find-drone.dto';

@Injectable()
export class DroneService {
  constructor(
    @InjectRepository(Drone)
    private readonly droneRepo: Repository<Drone>,
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async registerDrone(dto: CreateDroneDto): Promise<Drone> {
    const drone = this.droneRepo.create({ ...dto, state: DroneState.IDLE });
    const saved = await this.droneRepo.save(drone);
    await this.auditRepo.save({
      drone: saved,
      eventType: AuditEventType.STATE_CHANGE,
      metadata: { toState: DroneState.IDLE },
    });
    return saved;
  }

  async find(filter: FindDroneDto): Promise<Drone[]> {
    const qb = this.droneRepo.createQueryBuilder('drone');

    if (filter.state === 'available') {
      qb.andWhere('drone.state = :idle AND drone.batteryCapacity >= :min', {
        idle: DroneState.IDLE,
        min: 25,
      });
    } else if (filter.state) {
      qb.andWhere('drone.state = :state', { state: filter.state });
    }

    if (filter.model) {
      qb.andWhere('drone.model = :model', { model: filter.model });
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<Drone> {
    const drone = await this.droneRepo.findOne({ where: { id } });
    if (!drone) throw new NotFoundException(`Drone ${id} not found`);
    return drone;
  }

  async findBatteryLevel(id: string): Promise<number> {
    const drone = await this.findOne(id);
    return drone.batteryCapacity;
  }

  private async recordStateChange(
    drone: Drone,
    nextState: DroneState,
  ): Promise<Drone> {
    await this.auditRepo.save({
      drone,
      eventType: AuditEventType.STATE_CHANGE,
      metadata: { from: drone.state, to: nextState },
    });
    drone.state = nextState;
    return this.droneRepo.save(drone);
  }

  async deliver(id: string): Promise<Drone> {
    const drone = await this.findOne(id);
    if (drone.state !== DroneState.LOADED) {
      throw new BadRequestException(`Drone ${id} is not loaded`);
    }
    await this.recordStateChange(drone, DroneState.DELIVERING);
    setTimeout(async () => {
      await this.recordStateChange(drone, DroneState.DELIVERED);
      await this.recordStateChange(drone, DroneState.RETURNING);
      await this.recordStateChange(drone, DroneState.IDLE);
    }, 10000);
    return drone;
  }

  async completeDelivery(id: string): Promise<Drone> {
    const drone = await this.findOne(id);
    if (drone.state !== DroneState.DELIVERING) {
      throw new BadRequestException(`Drone ${id} is not delivering`);
    }
    await this.recordStateChange(drone, DroneState.DELIVERED);
    await this.recordStateChange(drone, DroneState.RETURNING);
    return this.recordStateChange(drone, DroneState.IDLE);
  }

  async unload(id: string): Promise<Drone> {
    const drone = await this.findOne(id);
    if (drone.state !== DroneState.DELIVERED) {
      throw new BadRequestException(`Drone ${id} has not delivered payload`);
    }
    return this.recordStateChange(drone, DroneState.IDLE);
  }

  async load(id: string): Promise<Drone> {
    const drone = await this.findOne(id);
    if (drone.state !== DroneState.IDLE) {
      throw new BadRequestException(`Drone ${id} is not idle`);
    }
    return this.recordStateChange(drone, DroneState.LOADING);
  }
}
