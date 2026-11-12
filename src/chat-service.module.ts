import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { ChatMessage } from './chat-message.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([ChatMessage]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatServiceModule {}
