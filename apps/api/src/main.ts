import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter, ActingContextGuard } from './common';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // Global prefix for all API routes
  app.setGlobalPrefix('api/v1');

  // CORS (allow self-origin and any configured origins)
  const corsOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'];
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-profile-id', 'x-workspace-id'],
    credentials: true,
  });

  // Global filters & pipes
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global acting context & workspace isolation guard
  const reflector = app.get(Reflector);
  const prismaService = app.get(PrismaService);
  app.useGlobalGuards(new ActingContextGuard(reflector, prismaService));

  // Swagger/OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CORVIIN HUB API')
    .setDescription(
      'Internal operations platform API for Corviin Group. Note: Acting profile selector (x-profile-id) models operational context and is NOT verified human authentication.',
    )
    .setVersion('0.1.0')
    .addApiKey({ type: 'apiKey', name: 'x-profile-id', in: 'header' }, 'profile-id')
    .addApiKey({ type: 'apiKey', name: 'x-workspace-id', in: 'header' }, 'workspace-id')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Single deployment: serve built web frontend if apps/web/dist exists
  const clientDistPath = path.resolve(__dirname, '../../web/dist');
  if (fs.existsSync(clientDistPath)) {
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use(express.static(clientDistPath));
    expressApp.get('*', (req: any, res: any, next: any) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
    logger.log(`Serving Web frontend from: ${clientDistPath}`);
  }

  const port = process.env.PORT || process.env.API_PORT || 3001;
  const host = process.env.API_HOST || '0.0.0.0';
  await app.listen(port, host);
  logger.log(`CORVIIN HUB running on http://${host}:${port}`);
  logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
