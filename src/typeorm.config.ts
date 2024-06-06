import { DataSource } from 'typeorm';
import { CONFIG } from './settings/app.settings';

export default new DataSource({
  url: CONFIG.DB_LINK,
  type: 'postgres',
  migrations: ['src/migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
});
