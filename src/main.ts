import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONFIG } from './settings/app.settings';
import { DataSource } from 'typeorm';
import { seedData } from './infrastructure/utils/seed-data';
import { applyAppSettings } from './settings/apply-app-settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //add mock data in db
  // const dataSource = app.get(DataSource);
  // await seedData(dataSource);

  applyAppSettings(app);

  await app.listen(CONFIG.PORT, () => {
    console.log('App starting listen on port: ', CONFIG.PORT);
    return;
  });
}

bootstrap();
