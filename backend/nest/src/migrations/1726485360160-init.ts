import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1726485360160 implements MigrationInterface {
  name = 'Init1726485360160'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "team" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "teamId" integer, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))')
    await queryRunner.query('ALTER TABLE "user" ADD CONSTRAINT "FK_1e89f1fd137dc7fea7242377e25" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP CONSTRAINT "FK_1e89f1fd137dc7fea7242377e25"')
    await queryRunner.query('DROP TABLE "user"')
    await queryRunner.query('DROP TABLE "team"')
  }
}
