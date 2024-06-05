import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../infrastructure/exeption-filters/http-exception-filter';
import cookieParser from 'cookie-parser';

export const applyAppSettings = (app: INestApplication) => {
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();
  app.use(cookieParser());
  setAppPipes(app);
  setAppExceptionsFilters(app);
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const customErrors = [];
        errors.forEach((err) => {
          // @ts-ignore
          const constraintKeys = Object.keys(err.constraints);
          constraintKeys.forEach((cKey) => {
            // @ts-ignore
            const msg = err.constraints[cKey];
            // @ts-ignore
            customErrors.push({ field: err.property, message: msg });
          });
        });
        throw new BadRequestException(customErrors);
      },
    }),
  );
};

const setAppExceptionsFilters = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter());
};
