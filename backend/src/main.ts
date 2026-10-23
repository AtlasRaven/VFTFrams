import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { ENV } from './config/env.config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CORS Configuration for Frontend (http://localhost:3000)
  app.enableCors({
    origin: [ENV.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With, X-Cart-ID',
  });

  // 2. Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // 3. Global Response Interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // 4. Start Server
  const port = ENV.PORT || 4000;
  await app.listen(port);

  console.log(`=======================================================`);
  console.log(
    `🌿 VFT Farms Backend API is running on http://localhost:${port}`,
  );
  console.log(`🌿 Base API prefix: http://localhost:${port}/api/v1`);
  console.log(`🌿 Environment: ${ENV.NODE_ENV}`);
  console.log(`=======================================================`);
}

void bootstrap().catch((error: unknown) => {
  console.error('Failed to start the VFT Farms API:', error);
  process.exitCode = 1;
});
