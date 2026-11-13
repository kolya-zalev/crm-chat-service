# crm-chat-service

Микросервис общего чата CRM: хранит сообщения сотрудников и отдаёт их историю.
Отвечает на вопрос «что писали в чате и кто».

- транспорт: **RabbitMQ**, очередь **`chat_queue`** (`@nestjs/microservices`), HTTP нет
- база: **`chat_db`** (PostgreSQL, TypeORM)
- вызывается только из [crm-gateway](https://github.com/kolya-zalev/crm-gateway)
- контракты: [@crm/shared](https://github.com/kolya-zalev/crm-shared) (`chatMessages`, `ChatContract`)

Сервис ничего не рассылает сам. Gateway вызывает `chat.create`, получает
созданное сообщение и отправляет его подключённым клиентам по SSE
(`GET /api/chat/sse`, событие `message`).

## Как проходит сообщение

```
браузер ──POST /api/chat/messages──▶ gateway ──chat.create──▶ chat_queue ──▶ chat-service ──▶ chat_db
браузер ◀──SSE "message"─────────── gateway ◀──ChatMessageDto───────────────────┘
```

## Сообщения

| Сообщение | Payload | Ответ |
|---|---|---|
| `chat.list` | `{}` | `ChatMessageDto[]`, старые сверху |
| `chat.create` | `{ actor, text }` | созданное `ChatMessageDto` |

Текст обрезается по краям; пустой или длиннее 2000 символов → `400`.
Автор берётся из `actor` (`id`, `name`), а не из тела запроса.

Ошибки (`BadRequestException`…) превращаются в RPC-ошибки с `statusCode`
через `HttpToRpcExceptionFilter`. Если сервис не запущен, gateway через 5 секунд
отвечает `503`.

## Данные

`ChatMessage`: `id` (uuid), `text`, `authorId`, `authorName`, `createdAt` (timestamptz, индекс).

Имя автора хранится в сообщении: после переименования пользователя старые сообщения
показывают имя на момент отправки.

## Переменные окружения

| Переменная | Пример |
|---|---|
| `CHAT_DATABASE_URL` | `postgresql://USER:PASSWORD@localhost:5432/chat_db` |
| `RABBIT_URL` | `amqp://USER:PASSWORD@localhost:5672` |

## Локальный запуск

Нужны PostgreSQL и RabbitMQ: проще всего поднять их из
[crm-infra](https://github.com/kolya-zalev/crm-infra) (`docker compose up -d db rabbitmq`).

```bash
cp .env.example .env
npm install
npm run migration:run
npm run start:dev
```

Проверка: в RabbitMQ UI (http://localhost:15672) у очереди `chat_queue` → Consumers: 1.

## Миграции

```bash
npm run migration:generate -- src/migrations/<Имя>   # по изменениям entity
npm run migration:run                                # применить
npm run migration:revert                             # откатить последнюю
```

`synchronize` выключен: схема меняется только миграциями.

## Docker

`Dockerfile` → `npm ci` → `nest build`.
`start.sh` → `typeorm migration:run -d dist/data-source.js` → `node dist/main`.

Запуск вместе с остальными — [crm-infra](https://github.com/kolya-zalev/crm-infra).
