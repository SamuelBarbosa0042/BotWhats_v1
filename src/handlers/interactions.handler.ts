import { Tables } from "../@types/tables";
import connection from "../core/database";

class InteractionHandler {
  async create(
    idUser: number,
    interaction: string,
    dialog: string,
    starDay?: Date
  ) {
    await connection<Tables.Interaction>("tb_interactions").insert({
      interaction,
      dialog,
      idUser,
      startDay: new Date(),
    });
  }
  async get(idUser: number) {
    return await connection<Tables.Interaction>("tb_interactions")
      .select("*")
      .where({ idUser })
      .first();
  }
  async remove(idUser: number) {
    await connection<Tables.Interaction>("tb_interactions")
      .where({ idUser })
      .first()
      .delete();
  }
}

export default new InteractionHandler();
