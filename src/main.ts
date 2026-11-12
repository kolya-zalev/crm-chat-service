import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CHAT_QUEUE, HttpToRpcExceptionFilter } from '@crm/shared';
import { ChatServiceModule } from './chat-service.module';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ChatServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_URL ?? 'amqp://localhost:5672'],
        queue: CHAT_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  app.useGlobalFilters(new HttpToRpcExceptionFilter());
  await app.listen();
  console.log('Chat service working');
}

bootstrap();
