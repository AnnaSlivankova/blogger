import { MigrationInterface, QueryRunner } from "typeorm";

export class Start06071717762040983 implements MigrationInterface {
    name = 'Start06071717762040983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rt_black_list" ("refreshToken" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cc0400f38c68a2ee5e2f5649d68" PRIMARY KEY ("refreshToken"))`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "lastActiveDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ADD "lastActiveDate" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`DROP TABLE "rt_black_list"`);
    }

}
