import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  //await knex("table_name").del();

  // Inserts seed entries
  await knex("tb_menu").insert([
    { menuCode: 1, menuName: "welcome", parentCode: null },
    { menuCode: 2, menuName: "Hora extra", parentCode: "1" },
    { menuCode: 3, menuName: "Nota Fiscal PJ", parentCode: "1" },
    { menuCode: 4, menuName: "Hour", parentCode: null },
    { menuCode: 6, menuName: "Incluir Horas", parentCode: "4" },
    { menuCode: 7, menuName: "excluir Horas", parentCode: "4" },
    { menuCode: 7, menuName: "Gerar Relatório", parentCode: "4" },
    { menuCode: 8, menuName: "Enviar Relatório Head", parentCode: "4" },
    { menuCode: 9, menuName: "Head Aprova Relatório", parentCode: "4" },
    {menuCode: 10, menuName: "Head", parentCode: null},
    {menuCode: 11, menuName: "Aprovar", parentCode: "10"},
    {menuCode: 12, menuName: "Recusar", parentCode: "10"},
    {menuCode: 13, menuName: "Ver", parentCode: "10"},
    // {menuCode: 14, menuName: "", parentCode: "10"},
    // {menuCode: 15, menuName: "", parentCode: ""},
    // {menuCode: 16, menuName: "", parentCode: ""},
    // {menuCode: 17, menuName: "", parentCode: ""},
    // {menuCode: 18, menuName: "", parentCode: ""},
    // {menuCode: 19, menuName: "", parentCode: ""},
    // {menuCode: 20, menuName: "", parentCode: ""}
  ]);
}
