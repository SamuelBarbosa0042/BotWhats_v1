// criar exportação em excell
import excel, { Table } from "exceljs";
import connection from "../../../core/database";
import { Tables } from "../../../@types/tables";
import WAWebJS from "whatsapp-web.js";
import path from "path";
import { messageHandler } from "../../../handlers/message.handler";

const getUser = async (message: WAWebJS.Message) => {
  const user = await connection<Tables.User>("tb_users")
    .select("*")
    .where({ wtsId: message.from })
    .first();
  return user;
};

export const createExcell = async (
  message: WAWebJS.Message,
  check: boolean
) => {
  const Ex = new excel.Workbook();
  const Sh = Ex.addWorksheet("relatorio_horas"); // colocar no template e melhorar o texto

  type Extrahours = {
    task: string;
    hours: string;
    date: string;
    coment: string;
  };

  Sh.columns = [
    { key: "task", header: "Chamado/Card" },
    { key: "hours", header: "Horas" },
    { key: "date", header: "data" },
    { key: "coment", header: "comentario" },
  ];

  const user = await getUser(message);
  let hours;
  if (check == true) {
    hours = await connection<Tables.Hour>("tb_hour")
      .select("*")
      .where({ idUser: user?.idUser })
      .where({ checkHead: false })
      .where({ checkFinance: false });
  } else {
    hours = await connection<Tables.Hour>("tb_hour")
      .select("*")
      .where({ idUser: user?.idUser })
      .where({ checkHead: true })
      .where({ checkFinance: false });
  }

  //console.log(hours.length);

  for (let i = 0; i < hours.length; i++) {
    //console.log(i);
    const row = [
      hours[i].taskNumber,
      hours[i].overTime,
      hours[i].date,
      hours[i].coment,
    ];
    //console.log(row);
    Sh.addRow(row);
  }
    async (message) => {
      const user = await getUser(message);
      const hourId = connection<Tables.Hour>("tb_hour")
        .select("idHour")
        .where({ idUser: user?.idUser, checkHead: true, checkFinance: false });

      connection<Tables.Hour>("tb_hour")
        .update({ checkFinance: true })
        .whereIn("idUser", hourId);
    };


  const nomeArquivo = `Relatorio_horas_${message.timestamp}.xlsx`;

  await Ex.xlsx.writeFile(path.resolve(__dirname, "c:/temp", nomeArquivo));

  return {
    name: nomeArquivo,
    path: path.resolve(__dirname, "c:/temp", nomeArquivo),
  };
};

type excellData = Tables.Hour & Partial<Tables.User>

export const generateExcell = async (
  archives : excellData[]
) => {
    const Ex = new excel.Workbook();
    const Sh = Ex.addWorksheet("relatorio_horas"); // colocar no template e melhorar o texto

    Sh.columns = [
      { key: "task", header: "Chamado/Card" },
      { key: "hours", header: "Horas" },
      { key: "date", header: "data" },
      { key: "coment", header: "comentario" },
    ];

    archives.forEach(archive => {
      const row = [
        archive.idHour,
        archive.taskNumber,
        archive.user,
        archive.date
        
      ]

      Sh.addRow(row)
    })
    const nomeArquivo = `Relatorio_horas_${Date.now()}.xlsx`;

    await Ex.xlsx.writeFile(path.resolve(__dirname, "c:/temp", nomeArquivo));
  
    return {
      name: nomeArquivo,
      path: path.resolve(__dirname, "c:/temp", nomeArquivo),
    };

}
