import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DroneModule } from './drone/drone.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MedicationModule } from './medication/medication.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env'],
		}),
		ScheduleModule.forRoot(),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (cfg: ConfigService) => ({
				type: 'sqlite',
				database: cfg.get<string>(
					'DB_PATH',
					__dirname + '/data/db.sqlite',
				),
				entities: [__dirname + '/**/*.entity.{ts,js}'],
				synchronize:
					cfg.get<string>('NODE_ENV', 'development') === 'development'
						? cfg.get<boolean>('DB_SYNC', true)
						: false,
			}),
		}),
		DroneModule,
		MedicationModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
