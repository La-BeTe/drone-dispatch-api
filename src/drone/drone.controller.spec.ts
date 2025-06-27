import { Test, TestingModule } from '@nestjs/testing';
import { DroneController } from './drone.controller';
import { DroneService } from './drone.service';
import { Drone, DroneModel, DroneState } from './drone.entity';
import { CreateDroneDto } from './dto/create-drone.dto';
import { FindDroneDto } from './dto/find-drone.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';
import { NotFoundException } from '@nestjs/common';

describe('DroneController', () => {
  let controller: DroneController;
  let service: jest.Mocked<DroneService>;

  const mockDroneService = () => ({
    registerDrone: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DroneController],
      providers: [{ provide: DroneService, useFactory: mockDroneService }],
    }).compile();

    controller = module.get<DroneController>(DroneController);
    service = module.get(DroneService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a drone', async () => {
      const dto: CreateDroneDto = {
        serialNumber: 'SN',
        model: DroneModel.LIGHTWEIGHT,
        weightLimit: 100,
        batteryCapacity: 100,
      };
      const drone = { ...dto, id: '1', state: DroneState.IDLE } as Drone;
      service.registerDrone.mockResolvedValue(drone);
      expect(await controller.register(dto)).toEqual(drone);
      expect(service.registerDrone).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return a list of drones', async () => {
      const drones = [{ id: '1' } as Drone];
      service.find.mockResolvedValue(drones);
      expect(await controller.findAll({} as FindDroneDto)).toEqual(drones);
      expect(service.find).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should return a drone by id', async () => {
      const drone = { id: '1' } as Drone;
      service.findOne.mockResolvedValue(drone);
      expect(await controller.findOne('1')).toEqual(drone);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
    it('should throw if not found', async () => {
      service.findOne.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a drone', async () => {
      const drone = { id: '1', state: DroneState.LOADED } as Drone;
      const dto: UpdateDroneDto = { state: DroneState.LOADED };
      service.update.mockResolvedValue(drone);
      expect(await controller.update('1', dto)).toEqual(drone);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
    it('should throw if not found', async () => {
      service.update.mockRejectedValue(new NotFoundException());
      await expect(
        controller.update('x', { state: DroneState.IDLE }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
