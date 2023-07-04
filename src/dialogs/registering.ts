import WAWebJS from "whatsapp-web.js";
import connection from "../core/database";
import { Tables } from "../@types/tables";
import Interactions from "../handlers/interactions.handler";
import { Templates } from "../handlers/templates";

class Registering {
  async registering_name(message: WAWebJS.Message) {
    const user = await connection<Tables.User>("tb_users")
      .select("*")
      .where({ wtsId: message.from })
      .first();
    await connection<Tables.User>("tb_users")
      .update({
        user: message.body,
      })
      .where({ idUser: user?.idUser });
    const interaction = await Interactions.get(user!.idUser);
    await Interactions.remove(interaction!.idInteraction);
    await Interactions.create(user!.idUser, "registering_email", "registering");
    await message.reply(Templates.dialogs.registering.registering_email);
  }
  async registering_email(message: WAWebJS.Message) {
    const user = await connection<Tables.User>("tb_users")
      .select("*")
      .where({ wtsId: message.from })
      .first();
    await connection<Tables.User>("tb_users")
      .update({
        email: message.body,
      })
      .where({ idUser: user?.idUser });
    const interaction = await Interactions.get(user!.idUser);
    await Interactions.remove(interaction!.idUser);
    await Interactions.create(user!.idUser, "registering_head", "registering");
    await message.reply(Templates.dialogs.registering.registering_head);
  }
  async registering_head(message: WAWebJS.Message) {
    const user = await connection<Tables.User>("tb_users")
      .select("*")
      .where({ wtsId: message.from })
      .first();
    const interaction = await Interactions.get(user!.idUser);
    if (message.body === "0") {
      await Interactions.remove(interaction!.idInteraction);
    }
    await connection<Tables.User>("tb_users")
      .update({
        emailHead: message.body,
      })
      .where({ idUser: user?.idUser });
    await Interactions.remove(interaction!.idUser);
    await message.reply(Templates.dialogs.registering.registration_completed);
  }
}

export default Registering;
