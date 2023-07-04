import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tb_menu", (table: Knex.TableBuilder) => {
    table.integer("menuCode");
    table.string("menuName");
    table.string("parentCode");
  });
}

export async function down(knex: Knex): Promise<void> {}
