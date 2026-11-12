import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatCreatePayload, chatMessages } from '@crm/shared';
import { ChatMessageDto } from '@crm/shared';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @MessagePattern(chatMessages.chatList)
  list(): Promise<ChatMessageDto[]> {
    return this.service.listMessage();
  }

  @MessagePattern(chatMessages.chatCreate)
  create(@Payload() payload: ChatCreatePayload): Promise<ChatMessageDto> {
    return this.service.createMessage(payload.actor, payload.text);
  }
}
