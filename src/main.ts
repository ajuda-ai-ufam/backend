import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as http from 'http'
import * as https from 'https'


async function bootstrap() {

  const httpsOptions = {
    key: fs.readFileSync('./secrets/key.pem', 'utf8'),
    cert: fs.readFileSync('./secrets/server.crt', 'utf8'),
  };

  const server = express();
  const app = await NestFactory.create(AppModule,new ExpressAdapter(server));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

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
    .addBearerAuth(
      {
        description: 'Please enter token in following format: Bearer <JWT>',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger', app, document);
  
  await app.init();

  http.createServer(server).listen(process.env.PORT_HTTP);
  https.createServer(httpsOptions,server).listen(process.env.PORT_HTTPS);
}
bootstrap();
