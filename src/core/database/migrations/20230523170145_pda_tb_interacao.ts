import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tb_interactions", (table) => {
    table.increments("idInteraction").primary().notNullable();
    table.string("interaction").notNullable();
    table.string("dialog").notNullable();
    table.date("startDay");
    table.integer("idUser");
    table.foreign("idUser").references("tb_menu");
  });
}

export async function down(knex: Knex): Promise<void> {}
