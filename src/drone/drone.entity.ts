// src/drones/drone.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum DroneModel {
  LIGHTWEIGHT = 'Lightweight',
  MIDDLEWEIGHT = 'Middleweight',
  CRUISERWEIGHT = 'Cruiserweight',
  HEAVYWEIGHT = 'Heavyweight',
}

export enum DroneState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  RETURNING = 'RETURNING',
}

@Entity()
export class Drone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  serialNumber: string;

  @Column({ type: 'simple-enum', enum: DroneModel })
  model: DroneModel;

  @Column('float')
  weightLimit: number;

  @Column('float')
  batteryCapacity: number;

  @Column({ type: 'simple-enum', enum: DroneState, default: DroneState.IDLE })
  state: DroneState;
}
