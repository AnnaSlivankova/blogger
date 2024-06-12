import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBlogNameToPostEntity1717793651648 implements MigrationInterface {
    name = 'AddBlogNameToPostEntity1717793651648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "blogName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "blogName"`);
    }

}
