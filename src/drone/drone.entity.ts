import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Medication } from '../medication/medication.entity';

export enum DroneModel {
  LIGHTWEIGHT = 'lightweight',
  MIDDLEWEIGHT = 'middleweight',
  CRUISERWEIGHT = 'cruiserweight',
  HEAVYWEIGHT = 'heavyweight',
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

  @ManyToMany(() => Medication, (med) => med.drones)
  @JoinTable({ name: 'drone_medications' })
  medications: Medication[];
}
