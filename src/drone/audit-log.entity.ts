import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Drone } from './drone.entity';

export enum AuditEventType {
  STATE_CHANGE = 'STATE_CHANGE',
  BATTERY_CHECK = 'BATTERY_CHECK',
}

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Drone, { onDelete: 'CASCADE' })
  drone: Drone;

  @Column({ type: 'simple-enum', enum: AuditEventType })
  eventType: AuditEventType;

  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  timestamp: Date;
}
