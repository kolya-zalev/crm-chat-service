import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ChatMessage } from './chat-message.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.CHAT_DATABASE_URL,
  entities: [ChatMessage],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
