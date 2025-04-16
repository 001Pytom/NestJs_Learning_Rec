import { MigrationInterface , QueryRunner} from "typeorm";

module.exports = class CoffeeRefactor1744809814780 implements MigrationInterface {

  public  async up(queryRunner:QueryRunner):Promise<any> {
        await queryRunner.query(`ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"`);
    }

  public  async down(queryRunner:QueryRunner):Promise<any> {

    await queryRunner.query(`ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`);
    }

}
