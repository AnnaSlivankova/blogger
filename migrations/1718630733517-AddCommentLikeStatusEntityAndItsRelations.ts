import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentLikeStatusEntityAndItsRelations1718630733517 implements MigrationInterface {
    name = 'AddCommentLikeStatusEntityAndItsRelations1718630733517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment_like_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "likeStatus" character varying(10) COLLATE "C" NOT NULL, "userId" uuid NOT NULL, "commentId" uuid NOT NULL, CONSTRAINT "PK_033f9eb48387c4e6b6a98c247c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comment_like_status" ADD CONSTRAINT "FK_7239a6640d6a515a4e01601fc32" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_like_status" ADD CONSTRAINT "FK_6664d48d2e27c43d4391daeb6b2" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_like_status" DROP CONSTRAINT "FK_6664d48d2e27c43d4391daeb6b2"`);
        await queryRunner.query(`ALTER TABLE "comment_like_status" DROP CONSTRAINT "FK_7239a6640d6a515a4e01601fc32"`);
        await queryRunner.query(`DROP TABLE "comment_like_status"`);
    }

}
