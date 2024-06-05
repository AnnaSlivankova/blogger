import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CONFIG } from './app.settings';

export interface DatabaseConfig {
  database: Partial<TypeOrmModuleOptions>;
}

export default (): DatabaseConfig => ({
  database: {
    type: 'postgres',
    url: CONFIG.DB_LINK,
    autoLoadEntities: true,
    // logging: ['query'],
    synchronize: false,
  },
});
