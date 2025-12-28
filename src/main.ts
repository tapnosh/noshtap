import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Enable global validation pipe for DTO validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.use((req, res, next) => {
    console.log('Incoming Request Origin:', req.headers.origin);
    console.log('Incoming Request Method:', req.method);
    next();
  });

  // Enable CORS 
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://tapnosh.com',
      'https://www.tapnosh.com',
      'https://tapnosh-tapnoshs-projects.vercel.app',
      /^https:\/\/tapnosh-[a-zA-Z0-9-]+-tapnoshs-projects\.vercel\.app$/,
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Noshtap API')
    .setDescription('The Noshtap API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui.css',
    customJs: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-bundle.js',
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js',
    ],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
