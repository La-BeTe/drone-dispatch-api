import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  synchronize: process.env.NODE_ENV === 'development',
};
