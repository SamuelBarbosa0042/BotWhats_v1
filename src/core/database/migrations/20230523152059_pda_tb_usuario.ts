import { default as knex, Knex } from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tb_users", (table: Knex.TableBuilder) => {
    table.increments("idUser");
    table.string("user");
    table.string("wtsId").notNullable();
    table.string("email");
    table.string("emailHead");
  });
}
export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("pda_tb_usuario");
}
