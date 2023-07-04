import WAWebJS from "whatsapp-web.js";
import connection from "../core/database";
import { Tables } from "../@types/tables";
import Interactions from "../handlers/interactions.handler";
import { create_hour } from "../core/actions/hour";
import showHour from "../core/actions/hour/hourShow";
import { messageHandler } from "../handlers/message.handler";
import client from "../core/client/wts.client";
import { Templates } from "../handlers/templates";
import hourShow from "../core/actions/hour/hourShow";
class Hour {
  private async getUser(message: WAWebJS.Message) {
    const user = await connection<Tables.User>("tb_users")
      .select("*")
      .where({ wtsId: message.from })
      .first();
    return user;
  }

  private async getExtraHour(message: WAWebJS.Message) {
    const user = await this.getUser(message);
    const horaExtra = await connection<Tables.Hour>("tb_hour")
      .select("*")
      .where({ idUser: user?.idUser })
      .orderBy("IncludeDate", "desc")
      .first();

    return horaExtra;
  }

  async createHour(message: WAWebJS.Message) {
    const user = await this.getUser(message);
    await connection<Tables.Hour>("tb_hour").insert({
      idUser: user?.idUser,
      date: message.body,
      checkHead: false,
      checkFinance: false,
      IncludeDate: new Date(),
    });

    const interaction = await Interactions.get(user!.idUser);
    await Interactions.remove(interaction!.idUser);
    await Interactions.create(user!.idUser, "updateHours", "hour");
    await client.sendMessage(
      message.from,
      Templates.dialogs.hourMaking.cadHour
    );
  }

  async updateHours(message: WAWebJS.Message) {
    const hour = await this.getExtraHour(message);
    const user = await this.getUser(message);
    await connection<Tables.Hour>("tb_hour")
      .update({ overTime: parseInt(message.body) })
      .where({ idHour: hour?.idHour });
    const interaction = await Interactions.get(user!.idUser);
    await Interactions.remove(interaction!.idUser);
    await Interactions.create(user!.idUser, "updateTask", "hour", new Date());
    await client.sendMessage(
      message.from,
      Templates.dialogs.hourMaking.cadTaskNum
    );
  }
  async updateTask(message: WAWebJS.Message) {
    const hour = await this.getExtraHour(message);
    const user = await this.getUser(message);
    await connection<Tables.Hour>("tb_hour")
      .update({ taskNumber: message.body })
      .where({ idHour: hour?.idHour });
    const interaction = await Interactions.get(user!.idUser);
    await Interactions.remove(interaction!.idUser);
    await Interactions.create(
      user!.idUser,
      "updateComentario",
      "hour",
      new Date()
    );
    await client.sendMessage(
      message.from,
      Templates.dialogs.hourMaking.cadComent
    );
  }

  async updateComentario(message: WAWebJS.Message) {
    const hour = await this.getExtraHour(message);
    const user = await this.getUser(message);
    await connection<Tables.Hour>("tb_hour")
      .update({ coment: message.body })
      .where({ idHour: hour?.idHour });
    const interaction = await Interactions.get(user!.idUser);
    await Interactions.remove(interaction!.idUser);
    await Interactions.create(user!.idUser, "redoHour", "welcome", new Date());
    await client.sendMessage(
      message.from,
      Templates.dialogs.hourMaking.cadComplete
    );
  }

  async excludeHour(message: WAWebJS.Message) {
    const horaId: number = parseInt(message.body);

    await connection<Tables.Hour>("tb_hour").delete().where({ idHour: horaId });
 }
}

export default Hour;
