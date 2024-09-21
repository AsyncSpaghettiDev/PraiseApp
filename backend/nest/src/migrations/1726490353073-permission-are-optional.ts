import { MigrationInterface, QueryRunner } from 'typeorm'

export class PermissionAreOptional1726490353073 implements MigrationInterface {
  name = 'PermissionAreOptional1726490353073'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "permissions" DROP NOT NULL'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "permissions" SET NOT NULL'
    )
  }
}
