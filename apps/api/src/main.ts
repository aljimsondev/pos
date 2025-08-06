import {
  Logger,
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

const API_PREFIX = 'api';
const VERSION_PREFIX = 'v';

const PORT = process.env.PORT ?? 4001;

// Helper function to filter Swagger document paths by tag
function filterDocumentByTag(
  document: any,
  tagToInclude?: string | null,
): OpenAPIObject {
  const clonedDocument = JSON.parse(JSON.stringify(document));

  if (!tagToInclude) {
    return clonedDocument;
  }
  for (const path in clonedDocument.paths) {
    for (const method in clonedDocument.paths[path]) {
      const operation = clonedDocument.paths[path][method];

      // If operation doesn't have the tag we want, remove it

      if (!operation.tags?.includes(tagToInclude)) {
        delete clonedDocument.paths[path][method];
      }
    }

    // If path has no methods left, remove the path
    if (Object.keys(clonedDocument.paths[path]).length === 0) {
      delete clonedDocument.paths[path];
    }
  }

  return clonedDocument;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    .setTitle('S-Tix Documentation')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'X-Access-Token',
      },
      'Access Token [Internal Use]',
    )
    .addCookieAuth(
      'AuthToken.id',
      {
        type: 'apiKey',
      },
      'Auth Cookie [Internal Use]',
    )
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
      'API Key [External Integration]',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT Bearer Token [External Integration]',
    )
    .setDescription(markdownDescription)
    .setVersion('0.0.1')
    .addTag('Getting Started')
    .addTag('Organization', 'Manage Event Organization resources endpoints')
    .addTag('Events', 'Manage Event ticketing resources endpoints')
    .addTag('Bookings', 'Manage booking events')
    .addTag('Analytics', 'Get analytics data')
    .addTag('Customer', 'Customer endpoints')
    .addTag('Features', 'Public features list queries')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config, {});

  //create filtered document
  const externalDocument = filterDocumentByTag(documentFactory(), 'external');
  const internalDocument = filterDocumentByTag(documentFactory(), null);

  const externalOptions: SwaggerCustomOptions = {
    explorer: true,

    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      withCredentials: true,
      persisAuthorization: true, // persist authentication across refreshes
    },
    customSiteTitle: 'API Documentation [Integration]',
    customCss: `.swagger-ui .topbar { background-color: #0078d7; }`,
  }; // external integration

  SwaggerModule.setup('ui/i', app, () => externalDocument, externalOptions); // external integration

  //Scalar Reference
  app.use(
    '/docs',
    apiReference({
      spec: { content: internalDocument },
      hideModels: true,
      hideDownloadButton: true,
      metaData: { title: 'S-Tix API [Internal]' },
    }),
  );

  SwaggerModule.setup('api', app, documentFactory);
  app.setGlobalPrefix(API_PREFIX);

  await app.listen(PORT);
  Logger.debug(`[server]: Running at port ${PORT}`);
  Logger.debug(`[server]: Docs available at: http://localhost:${PORT}/docs`);
}
bootstrap();
