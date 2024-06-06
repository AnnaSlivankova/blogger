import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConf, { type DatabaseConfig } from './settings/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './features/users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { CONFIG } from './settings/app.settings';
import { DropAllDataController } from './features/_testing/drop-all-data.controller';
import { AuthModule } from './features/auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConf],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(config: ConfigService<DatabaseConfig>) {
        return config.get('database', {
          infer: true,
        });
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: CONFIG.JWT_SECRET as string,
      signOptions: { expiresIn: CONFIG.ACCESS_TTL },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [DropAllDataController, AppController],
  providers: [],
})
export class AppModule {}
