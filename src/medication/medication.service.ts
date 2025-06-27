import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Medication } from './medication.entity';
import { CreateMedicationDto } from './dto/create-medication.dto';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(Medication)
    private readonly repo: Repository<Medication>,
  ) {}

  async create(dto: CreateMedicationDto): Promise<Medication> {
    const med = this.repo.create(dto);
    return this.repo.save(med);
  }

  async patch(medications: Medication[]): Promise<Medication[]> {
    return this.repo.save(medications);
  }

  async findAll(): Promise<Medication[]> {
    return this.repo.find();
  }

  async findByDrone(droneId: string): Promise<Medication[]> {
    return this.repo
      .createQueryBuilder('med')
      .innerJoin('med.drones', 'drone', 'drone.id = :id', { id: droneId })
      .getMany();
  }

  async findByIds(ids: string[]): Promise<Medication[]> {
    return this.repo.findBy({ id: In(ids) });
  }

  async findOne(id: string): Promise<Medication> {
    const med = await this.repo.findOne({ where: { id } });
    if (!med) throw new NotFoundException(`Medication ${id} not found`);
    return med;
  }

  // async update(id: string, dto: UpdateMedicationDto): Promise<Medication> {
  //   const med = await this.findOne(id);
  //   Object.assign(med, dto);
  //   return this.repo.save(med);
  // }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
