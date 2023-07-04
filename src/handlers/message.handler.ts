import WAWebJS from "whatsapp-web.js";
import connection from "../core/database";
import commandHandler from "./command.handler";
import { Tables } from "../@types/tables";
import Interactions from "./interactions.handler";
import { Templates } from "./templates";
const messageHandler = async (message: WAWebJS.Message) => {
  if ((await message.getChat()).isGroup) return;
  // console.debug(message);
  const registeredMember = await connection<Tables.User>("tb_users")
    .select("*")
    .where({
      wtsId: message.from,
    })
    .first();
  if (!registeredMember) {
    await commandHandler(message, true);
    return;
  }
  if (message.body.startsWith("/")) {
    await commandHandler(message);
    return;
  }

  const interaction = await Interactions.get(registeredMember.idUser);

  if (interaction && interaction.dialog) {
    const dialog = await import(`../dialogs/${interaction.dialog}`);
    const Dialog = new dialog.default();
    console.log(interaction.interaction + 1 + interaction.dialog);

    return await Dialog[interaction.interaction](message);
  }
  const menu = await connection<Tables.Menu>("tb_menu")
    .select("*")
    .whereNot("menuCode", 1)
    .whereNull("parentCode");
  await Interactions.create(registeredMember.idUser, "welcome", "welcome");
  await message.reply(Templates.menu(menu));
};

export { messageHandler };
