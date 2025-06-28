import { Test, TestingModule } from '@nestjs/testing';
import { MedicationController } from './medication.controller';
import { MedicationService } from './medication.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { NotFoundException } from '@nestjs/common';

describe('MedicationController', () => {
	let controller: MedicationController;
	let service: jest.Mocked<MedicationService>;

	const mockMedicationService = () => ({
		create: jest.fn(),
		findAll: jest.fn(),
		findByDrone: jest.fn(),
		findOne: jest.fn(),
		update: jest.fn(),
		remove: jest.fn(),
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [MedicationController],
			providers: [
				{
					provide: MedicationService,
					useFactory: mockMedicationService,
				},
			],
		}).compile();

		controller = module.get<MedicationController>(MedicationController);
		service = module.get(MedicationService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('create', () => {
		it('should create a medication', async () => {
			const dto: CreateMedicationDto = {
				name: 'A',
				weight: 1,
				code: 'A1',
			} as any;
			const med = {
				id: '1',
				name: 'A',
				weight: 1,
				code: 'A1',
				image: '',
				drones: [],
			};
			service.create.mockResolvedValue(med);
			expect(await controller.create(dto)).toEqual(med);
			expect(service.create).toHaveBeenCalledWith(dto);
		});
	});

	describe('findAll', () => {
		it('should return all medications with pagination', async () => {
			const meds = [
				{
					id: '1',
					name: 'A',
					weight: 1,
					code: 'A1',
					image: '',
					drones: [],
				},
			];
			const paginatedResponse = {
				data: meds,
				meta: {
					page: 1,
					limit: 10,
					total: 1,
					totalPages: 1,
					hasNextPage: false,
					hasPrevPage: false,
				},
			};
			service.findAll.mockResolvedValue(paginatedResponse);
			expect(await controller.findAll({})).toEqual(paginatedResponse);
			expect(service.findAll).toHaveBeenCalledWith({});
		});

		it('should handle pagination parameters', async () => {
			const meds = [
				{
					id: '1',
					name: 'A',
					weight: 1,
					code: 'A1',
					image: '',
					drones: [],
				},
				{
					id: '2',
					name: 'B',
					weight: 2,
					code: 'B2',
					image: '',
					drones: [],
				},
			];
			const paginatedResponse = {
				data: meds,
				meta: {
					page: 2,
					limit: 5,
					total: 25,
					totalPages: 5,
					hasNextPage: true,
					hasPrevPage: true,
				},
			};
			service.findAll.mockResolvedValue(paginatedResponse);
			expect(await controller.findAll({ page: 2, limit: 5 })).toEqual(
				paginatedResponse,
			);
			expect(service.findAll).toHaveBeenCalledWith({ page: 2, limit: 5 });
		});

		it('should filter medications by droneId', async () => {
			const meds = [
				{
					id: '1',
					name: 'A',
					weight: 1,
					code: 'A1',
					image: '',
					drones: [],
				},
			];
			const paginatedResponse = {
				data: meds,
				meta: {
					page: 1,
					limit: 10,
					total: 1,
					totalPages: 1,
					hasNextPage: false,
					hasPrevPage: false,
				},
			};
			service.findAll.mockResolvedValue(paginatedResponse);
			expect(await controller.findAll({ droneId: 'drone-123' })).toEqual(
				paginatedResponse,
			);
			expect(service.findAll).toHaveBeenCalledWith({
				droneId: 'drone-123',
			});
		});
	});

	describe('findOne', () => {
		it('should return a medication by id', async () => {
			const med = {
				id: '1',
				name: 'A',
				weight: 1,
				code: 'A1',
				image: '',
				drones: [],
			};
			service.findOne.mockResolvedValue(med);
			expect(await controller.findOne('1')).toEqual(med);
			expect(service.findOne).toHaveBeenCalledWith('1');
		});
		it('should throw if not found', async () => {
			service.findOne.mockRejectedValue(new NotFoundException());
			await expect(controller.findOne('x')).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('update', () => {
		it('should update a medication', async () => {
			const med = {
				id: '1',
				name: 'Updated Name',
				weight: 15,
				code: 'A1',
				image: '',
				drones: [],
			};
			const dto = { name: 'Updated Name', weight: 15 };
			service.update.mockResolvedValue(med);
			expect(await controller.update('1', dto)).toEqual(med);
			expect(service.update).toHaveBeenCalledWith('1', dto);
		});

		it('should throw if not found', async () => {
			service.update.mockRejectedValue(new NotFoundException());
			await expect(
				controller.update('x', { name: 'New Name' }),
			).rejects.toThrow(NotFoundException);
		});
	});

	describe('remove', () => {
		it('should remove a medication', async () => {
			service.remove.mockResolvedValue(undefined);
			await controller.remove('1');
			expect(service.remove).toHaveBeenCalledWith('1');
		});
	});
});
