import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBlogEntity1717762166737 implements MigrationInterface {
    name = 'AddBlogEntity1717762166737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(15) COLLATE "C" NOT NULL, "description" character varying(500) NOT NULL, "websiteUrl" character varying(100) COLLATE "C" NOT NULL, "isMembership" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "blog"`);
    }

}
