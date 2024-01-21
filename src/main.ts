import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Go-Non-Go Matrix API Documentation')
    .setContact('Rodrigo Melo', 'https://github.com/UpperApps', 'upperapps@gmail.com')
    .setDescription('API Documentation for Go-Non-Go Matrix')
    .setLicense('GNU', 'https://www.gnu.org/licenses/gpl-3.0.pt-br.html')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  });

  app.useGlobalPipes(validationPipe);

  await app.listen(3000);
}
bootstrap();
