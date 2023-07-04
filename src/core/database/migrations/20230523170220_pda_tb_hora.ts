import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tb_hour", (table) => {
    table.increments("idHour");
    table.integer("overTime");
    table.string("date");
    table.string("coment");
    table.string("taskNumber");
    table.string("idUser");
    table.boolean("checkHead");
    table.boolean("checkFinance");
    table.string("includeDate");
    table.foreign("idUser").references("tb_users");
  });
}

export async function down(knex: Knex): Promise<void> {}
