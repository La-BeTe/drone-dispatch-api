import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Drone } from '../drone/drone.entity';

@Entity()
export class Medication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column('float')
  weight: number;

  @Column({ length: 100, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  image: string;

  @ManyToMany(() => Drone, (drone) => drone.medications)
  drones: Drone[];
}
