import {
  Logger,
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppExceptionFilter } from 'src/core/filters/app-exception.filter';
import { ApiResponseInterceptor } from 'src/core/interceptors/api-response.interceptor';
import { AppModule } from './app.module';

const API_PREFIX = 'api';
const VERSION_PREFIX = 'v';

const PORT = process.env.PORT ?? 4001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // disable bodyParser required for better-auth
  });

  // Global response interceptor
  app.useGlobalInterceptors(new ApiResponseInterceptor());

  // Register the global filter
  app.useGlobalFilters(new AppExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  //API Prefix
  app.setGlobalPrefix(API_PREFIX);

  //API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: VERSION_PREFIX,
    defaultVersion: VERSION_NEUTRAL,
  });

  app.use(cookieParser());

  app.use(compression({ filter: shouldCompress }));

  function shouldCompress(req: Request, res: Response): boolean {
    return req.headers['accept'].includes('application/json');
  }

  const markdownDescription = readFileSync(
    join('__dirname', '../docs', 'getting-started.md'),
    'utf8',
  );

  //OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('POS API Documentation')
    .setDescription(markdownDescription)
    .addTag('Getting Started')
    .build();

  const document = SwaggerModule.createDocument(app, config, {});

  //Scalar Reference
  app.use('/docs', apiReference({ content: document }));

  app.setGlobalPrefix(API_PREFIX);

  await app.listen(PORT);
  Logger.debug(`[server]: Running at port ${PORT}`);
  Logger.debug(`[server]: Docs available at: http://localhost:${PORT}/docs`);
}
bootstrap();
