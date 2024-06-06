import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeviceEntity1717586966972 implements MigrationInterface {
    name = 'AddDeviceEntity1717586966972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "device" ("deviceId" uuid NOT NULL, "userId" uuid NOT NULL, "ip" character varying NOT NULL, "userAgent" character varying NOT NULL, "lastActiveDate" TIMESTAMP WITH TIME ZONE NOT NULL, "rt" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6fe2df6e1c34fc6c18c786ca26e" PRIMARY KEY ("deviceId"))`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc"`);
        await queryRunner.query(`DROP TABLE "device"`);
    }

}
