import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1794480649144 implements MigrationInterface {
    name = 'Init1794480649144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ChatMessage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "authorId" text NOT NULL, "authorName" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2d2bc310daa393ef9cedf6887c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8f1f00bbfbafc16b030256e036" ON "ChatMessage" ("createdAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8f1f00bbfbafc16b030256e036"`);
        await queryRunner.query(`DROP TABLE "ChatMessage"`);
    }

}
