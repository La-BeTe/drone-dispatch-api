import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Drone, DroneModel, DroneState } from './drone/drone.entity';
import { Medication } from './medication/medication.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';

async function seed() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const droneRepo = app.get(getRepositoryToken(Drone));
  const medRepo = app.get(getRepositoryToken(Medication));

  // Clear existing data
  await medRepo.clear();
  await droneRepo.clear();

  // Create medications
  const meds = await medRepo.save([
    medRepo.create({
      name: 'PARACETAMOL',
      weight: 50,
      code: 'PARA_001',
      image: 'https://dummyimage.com/100x100/000/fff&text=PARA',
    }),
    medRepo.create({
      name: 'AMOXICILLIN',
      weight: 30,
      code: 'AMOX_002',
      image: 'https://dummyimage.com/100x100/000/fff&text=AMOX',
    }),
    medRepo.create({
      name: 'IBUPROFEN',
      weight: 20,
      code: 'IBUP_003',
      image: 'https://dummyimage.com/100x100/000/fff&text=IBUP',
    }),
    medRepo.create({
      name: 'VITAMIN_C',
      weight: 10,
      code: 'VITC_004',
      image: 'https://dummyimage.com/100x100/000/fff&text=VITC',
    }),
  ]);

  // Create drones
  const drones = await droneRepo.save([
    droneRepo.create({
      serialNumber: 'DRONE001',
      model: DroneModel.LIGHTWEIGHT,
      weightLimit: 100,
      batteryCapacity: 100,
      state: DroneState.IDLE,
    }),
    droneRepo.create({
      serialNumber: 'DRONE002',
      model: DroneModel.MIDDLEWEIGHT,
      weightLimit: 200,
      batteryCapacity: 90,
      state: DroneState.IDLE,
    }),
    droneRepo.create({
      serialNumber: 'DRONE003',
      model: DroneModel.CRUISERWEIGHT,
      weightLimit: 300,
      batteryCapacity: 80,
      state: DroneState.IDLE,
    }),
    droneRepo.create({
      serialNumber: 'DRONE004',
      model: DroneModel.HEAVYWEIGHT,
      weightLimit: 400,
      batteryCapacity: 70,
      state: DroneState.IDLE,
    }),
    droneRepo.create({
      serialNumber: 'DRONE005',
      model: DroneModel.LIGHTWEIGHT,
      weightLimit: 120,
      batteryCapacity: 60,
      state: DroneState.IDLE,
    }),
    droneRepo.create({
      serialNumber: 'DRONE006',
      model: DroneModel.MIDDLEWEIGHT,
      weightLimit: 220,
      batteryCapacity: 50,
      state: DroneState.IDLE,
    }),
    droneRepo.create({
      serialNumber: 'DRONE007',
      model: DroneModel.CRUISERWEIGHT,
      weightLimit: 320,
      batteryCapacity: 40,
      state: DroneState.IDLE,
    }),
    droneRepo.create({
      serialNumber: 'DRONE008',
      model: DroneModel.HEAVYWEIGHT,
      weightLimit: 420,
      batteryCapacity: 30,
      state: DroneState.IDLE,
    }),
    droneRepo.create({
      serialNumber: 'DRONE009',
      model: DroneModel.LIGHTWEIGHT,
      weightLimit: 140,
      batteryCapacity: 25,
      state: DroneState.IDLE,
    }),
    droneRepo.create({
      serialNumber: 'DRONE010',
      model: DroneModel.MIDDLEWEIGHT,
      weightLimit: 240,
      batteryCapacity: 20,
      state: DroneState.IDLE,
    }),
  ]);

  // Assign some medications to a drone (simulate loading)
  drones[0].medications = [meds[0], meds[1]];
  drones[1].medications = [meds[2]];
  await droneRepo.save([drones[0], drones[1]]);

  await app.close();
  console.log('Database seeded successfully!');
}

seed();
