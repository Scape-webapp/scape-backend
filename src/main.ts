import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
  });

  const config = new DocumentBuilder()
    .setTitle('Scape')
    .setDescription('The Scape API description')
    .setVersion('1.0')
    .addTag('Scape')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(parseInt(process.env.PORT), () =>
    console.log(`Server Is live on port: ${process.env.PORT}`),
  );
}
bootstrap();
