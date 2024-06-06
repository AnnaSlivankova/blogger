import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRtBlackListEntity1717595927558 implements MigrationInterface {
    name = 'AddRtBlackListEntity1717595927558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rt_black_list" ("refreshToken" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cc0400f38c68a2ee5e2f5649d68" PRIMARY KEY ("refreshToken"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "rt_black_list"`);
    }

}
