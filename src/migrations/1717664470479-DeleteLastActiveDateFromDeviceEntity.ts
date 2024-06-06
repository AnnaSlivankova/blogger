import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteLastActiveDateFromDeviceEntity1717664470479 implements MigrationInterface {
    name = 'DeleteLastActiveDateFromDeviceEntity1717664470479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "lastActiveDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ADD "lastActiveDate" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

}
