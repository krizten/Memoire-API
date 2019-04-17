import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';
import { FileLogger } from './shared/file-logger.service';

config();
const port = process.env.PORT || 8080;
const host = process.env.HOST || '127.0.0.1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Middlewares
  app.use(helmet());
  app.enableCors({
    origin: '*',
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
    credentials: true,
    methods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
  });
  app.use(
    new rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Memoire App WebAPI')
    .setDescription(
      'REST API endpoints documentation for Memoire app. Memoire is an online journal where users can pen down their thoughts and feelings.',
    )
    .setVersion('1.0')
    .setContactEmail('mailstochristian@gmail.com')
    .setLicense('MIT', 'https://github.com/krizten/Memoire-API/blob/dev/LICENSE')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
  const startupMsg = `Server is running on http://${host}:${port}`;
  Logger.log(startupMsg, 'Bootstrap');
  FileLogger.log(startupMsg);
}
bootstrap();
