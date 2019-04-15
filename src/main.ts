import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { FileLogger } from './shared/file-logger.service';

config();
const port = process.env.PORT || 8080;
const host = process.env.HOST || '127.0.0.1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Memoire REST API')
    .setDescription(
      'REST API endpoints documentation for Memoire app. Memoire is an online journal where users can pen down their thoughts and feelings.',
    )
    .setVersion('1.0')
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