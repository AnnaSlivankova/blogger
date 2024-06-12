import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1717863940915 implements MigrationInterface {
    name = 'Test1717863940915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "blogName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "blogName" character varying NOT NULL`);
    }

}
