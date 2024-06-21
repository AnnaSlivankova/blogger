import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedNullableStatusInCommentLikeStatusEntity1718634672752 implements MigrationInterface {
    name = 'ChangedNullableStatusInCommentLikeStatusEntity1718634672752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_like_status" ALTER COLUMN "likeStatus" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_like_status" ALTER COLUMN "likeStatus" SET NOT NULL`);
    }

}
