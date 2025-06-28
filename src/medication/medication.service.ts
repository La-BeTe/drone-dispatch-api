import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Medication } from './medication.entity';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

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

	async findByCodes(codes: string[]): Promise<Medication[]> {
		return this.repo.findBy({ code: In(codes) });
	}

	async findOne(id: string): Promise<Medication> {
		const med = await this.repo.findOne({
			where: { id },
			relations: ['drones'],
		});
		if (!med) throw new NotFoundException(`Medication ${id} not found`);
		return med;
	}

	async update(id: string, dto: UpdateMedicationDto): Promise<Medication> {
		const med = await this.findOne(id);
		Object.assign(med, dto);
		await this.repo.save(med);
		return this.findOne(id);
	}

	async remove(id: string): Promise<void> {
		// First, clear the many-to-many relationship by deleting from join table
		await this.repo
			.createQueryBuilder()
			.delete()
			.from('drone_medications')
			.where('medicationId = :id', { id })
			.execute();

		// Now delete the medication
		await this.repo.delete(id);
	}
}
