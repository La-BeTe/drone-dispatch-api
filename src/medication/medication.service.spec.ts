import { Test, TestingModule } from '@nestjs/testing';
import { MedicationService } from './medication.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Medication } from './medication.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('MedicationService', () => {
	let service: MedicationService;
	let repo: jest.Mocked<Repository<Medication>>;

	const mockRepo = () =>
		({
			create: jest.fn(),
			save: jest.fn(),
			find: jest.fn(),
			findOne: jest.fn(),
			findBy: jest.fn(),
			delete: jest.fn(),
			createQueryBuilder: jest.fn(() => ({
				innerJoin: jest.fn().mockReturnThis(),
				delete: jest.fn().mockReturnThis(),
				from: jest.fn().mockReturnThis(),
				where: jest.fn().mockReturnThis(),
				execute: jest.fn(),
				getMany: jest.fn(),
			})),
		}) as any;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MedicationService,
				{
					provide: getRepositoryToken(Medication),
					useFactory: mockRepo,
				},
			],
		}).compile();

		service = module.get<MedicationService>(MedicationService);
		repo = module.get(getRepositoryToken(Medication));
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should create and save a medication', async () => {
			const dto = { name: 'A', weight: 1, code: 'A1' };
			const med = { ...dto } as Medication;
			repo.create.mockReturnValue(med);
			repo.save.mockResolvedValue(med);
			expect(await service.create(dto as any)).toEqual(med);
			expect(repo.create).toHaveBeenCalledWith(dto);
			expect(repo.save).toHaveBeenCalledWith(med);
		});
	});

	describe('findAll', () => {
		it('should return all medications', async () => {
			const meds = [{ id: '1' } as Medication];
			repo.find.mockResolvedValue(meds);
			expect(await service.findAll()).toEqual(meds);
		});
	});

	describe('findByDrone', () => {
		it('should return medications for a drone', async () => {
			const getMany = jest.fn().mockResolvedValue([{ id: '1' }]);
			repo.createQueryBuilder.mockReturnValue({
				innerJoin: jest.fn().mockReturnThis(),
				getMany,
			} as any);
			expect(await service.findByDrone('d1')).toEqual([{ id: '1' }]);
		});
	});

	describe('findByCodes', () => {
		it('should return medications by codes', async () => {
			const meds = [{ id: '1' } as Medication];
			repo.findBy.mockResolvedValue(meds);
			expect(await service.findByCodes(['CODE1', 'CODE2'])).toEqual(meds);
			expect(repo.findBy).toHaveBeenCalledWith(
				expect.objectContaining({
					code: expect.any(Object),
				}),
			);
		});
	});

	describe('findOne', () => {
		it('should return a medication by id', async () => {
			const med = { id: '1' } as Medication;
			repo.findOne.mockResolvedValue(med);
			expect(await service.findOne('1')).toEqual(med);
		});
		it('should throw if not found', async () => {
			repo.findOne.mockResolvedValue(null);
			await expect(service.findOne('x')).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('update', () => {
		it('should update a medication', async () => {
			const med = { id: '1', name: 'Old Name', weight: 10 } as Medication;
			const updateDto = { name: 'New Name', weight: 15 };
			const updatedMed = { ...med, ...updateDto };

			repo.findOne.mockResolvedValue(med);
			repo.save.mockResolvedValue(updatedMed);

			const result = await service.update('1', updateDto);
			expect(result).toEqual(updatedMed);
			expect(repo.save).toHaveBeenCalledWith(updatedMed);
		});

		it('should throw if medication not found', async () => {
			repo.findOne.mockResolvedValue(null);
			await expect(
				service.update('x', { name: 'New Name' }),
			).rejects.toThrow(NotFoundException);
		});

		it('should update only provided fields', async () => {
			const med = {
				id: '1',
				name: 'Old Name',
				weight: 10,
				code: 'OLD123',
			} as Medication;
			const updateDto = { name: 'New Name' };
			const updatedMed = { ...med, name: 'New Name' };

			repo.findOne.mockResolvedValue(med);
			repo.save.mockResolvedValue(updatedMed);

			const result = await service.update('1', updateDto);
			expect(result.name).toBe('New Name');
			expect(result.weight).toBe(10);
			expect(result.code).toBe('OLD123');
		});
	});

	describe('remove', () => {
		it('should delete a medication', async () => {
			repo.delete.mockResolvedValue({} as any);
			await service.remove('1');
			expect(repo.delete).toHaveBeenCalledWith('1');
		});
	});
});
