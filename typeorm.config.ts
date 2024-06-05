import { DataSource } from 'typeorm';
import { CONFIG } from './src/settings/app.settings';

export default new DataSource({
  url: CONFIG.DB_LINK,
  type: 'postgres',
  migrations: ['migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
});
