import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from './chat-message.entity';
import { Repository } from 'typeorm';
import { Actor } from '@crm/shared';
import { ChatMessageDto } from '@crm/shared';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly repo: Repository<ChatMessage>,
  ) {}

  private toDto(row: {
    id: string;
    text: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
  }): ChatMessageDto {
    return {
      id: row.id,
      text: row.text,
      authorId: row.authorId,
      authorName: row.authorName,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async listMessage(): Promise<ChatMessageDto[]> {
    const rows = await this.repo.find({
      order: { createdAt: 'ASC' },
    });
    return rows.map((row) => this.toDto(row));
  }

  async createMessage(actor: Actor, rawText: string): Promise<ChatMessageDto> {
    const text = rawText.trim();
    if (!text) {
      throw new BadRequestException('Text is required');
    }
    if (text.length > 2000) {
      throw new BadRequestException('Text must be at most 2000 characters');
    }
    const row = await this.repo.save(
      this.repo.create({
        text,
        authorId: actor.id,
        authorName: actor.name?.trim() || 'User',
      }),
    );
    const dto = this.toDto(row);
    return dto;
  }
}
