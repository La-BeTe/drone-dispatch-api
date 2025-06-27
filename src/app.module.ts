import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DroneModule } from './drone/drone.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'sqlite',
        database: cfg.get<string>('DB_PATH', 'db.sqlite'),
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        synchronize: cfg.get<boolean>('DB_SYNC', false),
      }),
    }),
    DroneModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
