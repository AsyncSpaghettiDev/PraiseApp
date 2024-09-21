import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddRefreshTokenToUser1726489603374 implements MigrationInterface {
  name = 'AddRefreshTokenToUser1726489603374'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user" ADD "permissions" character varying NOT NULL'
    )
    await queryRunner.query(
      'ALTER TABLE "user" ADD "refreshToken" character varying'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "refreshToken"')
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "permissions"')
  }
}
