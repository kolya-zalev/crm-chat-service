import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('ChatMessage')
@Index(['createdAt'])
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  text: string;

  @Column('text')
  authorId: string;

  @Column('text')
  authorName: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
