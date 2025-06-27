import { Test, TestingModule } from '@nestjs/testing';
import { DroneService } from './drone.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Drone, DroneModel, DroneState } from './drone.entity';
import { AuditLog, AuditEventType } from './audit-log.entity';
import { Medication } from '../medication/medication.entity';
import { MedicationService } from '../medication/medication.service';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockDroneRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  })),
});
const mockAuditRepo = () => ({
  save: jest.fn(),
  create: jest.fn(),
});
const mockMedService = () => ({
  findByIds: jest.fn(),
});

describe('DroneService', () => {
  let service: DroneService;
  let droneRepo: ReturnType<typeof mockDroneRepo>;
  let auditRepo: ReturnType<typeof mockAuditRepo>;
  let medService: ReturnType<typeof mockMedService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DroneService,
        { provide: getRepositoryToken(Drone), useFactory: mockDroneRepo },
        { provide: getRepositoryToken(AuditLog), useFactory: mockAuditRepo },
        { provide: MedicationService, useFactory: mockMedService },
      ],
    }).compile();

    service = module.get<DroneService>(DroneService);
    droneRepo = module.get(getRepositoryToken(Drone));
    auditRepo = module.get(getRepositoryToken(AuditLog));
    medService = module.get(MedicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerDrone', () => {
    it('registers and logs a new drone', async () => {
      const dto = {
        serialNumber: 'SN',
        model: DroneModel.LIGHTWEIGHT,
        weightLimit: 100,
        batteryCapacity: 100,
      };
      const drone = { ...dto, state: DroneState.IDLE };
      droneRepo.create.mockReturnValue(drone);
      droneRepo.save.mockResolvedValue(drone);
      auditRepo.save.mockResolvedValue({});
      const result = await service.registerDrone(dto as any);
      expect(droneRepo.create).toHaveBeenCalledWith({
        ...dto,
        state: DroneState.IDLE,
      });
      expect(droneRepo.save).toHaveBeenCalledWith(drone);
      expect(auditRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ eventType: AuditEventType.STATE_CHANGE }),
      );
      expect(result).toEqual(drone);
    });
  });

  describe('find', () => {
    it('returns filtered drones (available)', async () => {
      const getMany = jest.fn().mockResolvedValue(['drone1']);
      droneRepo.createQueryBuilder.mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        getMany,
      });
      const result = await service.find({ state: 'available' } as any);
      expect(result).toEqual(['drone1']);
    });
  });

  describe('findOne', () => {
    it('returns a drone with medications', async () => {
      const drone = { id: '1', medications: [] };
      droneRepo.findOne.mockResolvedValue(drone);
      expect(await service.findOne('1')).toBe(drone);
    });
    it('throws if not found', async () => {
      droneRepo.findOne.mockResolvedValue(undefined);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('loadDrone', () => {
    const drone = {
      id: '1',
      batteryCapacity: 100,
      state: DroneState.IDLE,
      weightLimit: 100,
      medications: [],
    };
    const meds = [
      { id: 'm1', weight: 40 },
      { id: 'm2', weight: 50 },
    ];
    beforeEach(() => {
      droneRepo.findOne.mockResolvedValue({ ...drone });
      medService.findByIds.mockResolvedValue(meds);
      auditRepo.save.mockResolvedValue({});
      droneRepo.save.mockResolvedValue({ ...drone });
    });
    it('loads drone if all checks pass', async () => {
      const result = await service.loadDrone('1', {
        medicationIds: ['m1', 'm2'],
      });
      expect(result).toBeDefined();
      expect(auditRepo.save).toHaveBeenCalled();
    });
    it('throws if battery < 25%', async () => {
      droneRepo.findOne.mockResolvedValue({ ...drone, batteryCapacity: 20 });
      await expect(
        service.loadDrone('1', { medicationIds: ['m1'] }),
      ).rejects.toThrow(BadRequestException);
    });
    it('throws if not idle', async () => {
      droneRepo.findOne.mockResolvedValue({
        ...drone,
        state: DroneState.LOADED,
      });
      await expect(
        service.loadDrone('1', { medicationIds: ['m1'] }),
      ).rejects.toThrow(BadRequestException);
    });
    it('throws if medication not found', async () => {
      medService.findByIds.mockResolvedValue([meds[0]]);
      await expect(
        service.loadDrone('1', { medicationIds: ['m1', 'm2'] }),
      ).rejects.toThrow(NotFoundException);
    });
    it('throws if overweight', async () => {
      medService.findByIds.mockResolvedValue([
        { id: 'm1', weight: 60 },
        { id: 'm2', weight: 60 },
      ]);
      await expect(
        service.loadDrone('1', { medicationIds: ['m1', 'm2'] }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('initiates delivery if state is DELIVERING', async () => {
      const drone = { id: '1', state: DroneState.LOADED };
      droneRepo.findOne.mockResolvedValue(drone);
      service['initiateDelivery'] = jest.fn().mockResolvedValue('delivering');
      const result = await service.update('1', {
        state: DroneState.DELIVERING,
      });
      expect(service['initiateDelivery']).toHaveBeenCalledWith(drone);
      expect(result).toBe('delivering');
    });
    it('completes delivery if state is DELIVERED', async () => {
      const drone = { id: '1', state: DroneState.DELIVERING };
      droneRepo.findOne.mockResolvedValue(drone);
      service['completeDelivery'] = jest.fn().mockResolvedValue('delivered');
      const result = await service.update('1', { state: DroneState.DELIVERED });
      expect(service['completeDelivery']).toHaveBeenCalledWith(drone);
      expect(result).toBe('delivered');
    });
    it('throws if drone not found', async () => {
      droneRepo.findOne.mockResolvedValue(undefined);
      await expect(
        service.update('x', { state: DroneState.IDLE }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBatteryLevel', () => {
    it('returns battery capacity', async () => {
      service.findOne = jest.fn().mockResolvedValue({ batteryCapacity: 77 });
      expect(await service.findBatteryLevel('1')).toBe(77);
    });
  });

  describe('handleBatteryAudit', () => {
    it('logs battery levels for all drones', async () => {
      droneRepo.find.mockResolvedValue([{ id: '1', batteryCapacity: 50 }]);
      auditRepo.create.mockReturnValue({});
      auditRepo.save.mockResolvedValue([]);
      await service.handleBatteryAudit();
      expect(auditRepo.save).toHaveBeenCalled();
    });
  });
});
