import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Super Monitoria API')
    .setDescription('Backend Super Monitoria')
    .setVersion('1.0')
    .addTag('Super Monitoria')
    .addBearerAuth({
      description: 'Please enter token in following format: Bearer <JWT>',
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger', app, document);

  await app.init();

  if (process.env.NODE_ENV === 'staging') {
    const httpsOptions = {
      key: fs.readFileSync('./secrets/key.pem', 'utf8'),
      cert: fs.readFileSync('./secrets/server.crt', 'utf8'),
    };
    https.createServer(httpsOptions, server).listen(process.env.PORT_HTTPS);
  } else {
    http.createServer(server).listen(process.env.PORT_HTTP);
  }
}
bootstrap();
