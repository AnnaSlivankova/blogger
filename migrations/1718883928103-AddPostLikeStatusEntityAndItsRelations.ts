import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostLikeStatusEntityAndItsRelations1718883928103 implements MigrationInterface {
    name = 'AddPostLikeStatusEntityAndItsRelations1718883928103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_like_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "likeStatus" character varying(10) COLLATE "C", "userId" uuid NOT NULL, "postId" uuid NOT NULL, CONSTRAINT "PK_22aaf8c69127908100dbfa96d9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post_like_status" ADD CONSTRAINT "FK_f306ec8cbd8f0292c01bdebb2db" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_like_status" ADD CONSTRAINT "FK_a2c8e0cffd9851d0be79fca1b37" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_like_status" DROP CONSTRAINT "FK_a2c8e0cffd9851d0be79fca1b37"`);
        await queryRunner.query(`ALTER TABLE "post_like_status" DROP CONSTRAINT "FK_f306ec8cbd8f0292c01bdebb2db"`);
        await queryRunner.query(`DROP TABLE "post_like_status"`);
    }

}
