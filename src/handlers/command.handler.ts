import WAWebJS from "whatsapp-web.js";
import { Tables } from "../@types/tables";
import connection from "../core/database";
import { Templates } from "./templates";
import interaction from "./interactions.handler";
import client from "../core/client/wts.client";

const commandHandler = async (
  message: WAWebJS.Message,
  unauthorized = false
) => {
  if (!message.body.startsWith("/")) return false;
  const args = message.body.slice("/".length).trim().split(/ +/g);
  const command = args?.shift()?.toLowerCase();

  if (command !== "registrar" && unauthorized)
    return await message.reply(
      "Por favor, cadastre-se primeiro antes de interagir. Envie /registrar"
    );
  if (command === "registrar") {
    if (!unauthorized)
      return await message.reply(Templates.messages.already_registered);
    await connection<Tables.User>("tb_users").insert({
      wtsId: message.from,
    });
    const user = await connection<Tables.User>("tb_users")
      .select("*")
      .where({ wtsId: message.from })
      .first();
    await connection<Tables.Interaction>("tb_interactions")
      .insert({
        interaction: "registering_name",
        dialog: "registering",
        idUser: user!.idUser,
      })
      .then(async (rows) => {
        console.log(rows);
        await message.reply(Templates.dialogs.registering.registering_name);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  if (command === "recadastrar") {
    return await message.reply(Templates.messages.not_implemented);
  }
  if (command === "0") {
    const user = await connection<Tables.User>("tb_users")
      .select("*")
      .where({ wtsId: message.from })
      .first();
    await interaction.remove(user!.idUser);
    return client.sendMessage(message.from, Templates.operation.canceled);
  }
};

export default commandHandler;
