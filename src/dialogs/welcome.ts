import WAWebJS, { MessageMedia } from "whatsapp-web.js";
import connection from "../core/database";
import { Tables } from "../@types/tables";
import Interactions from "../handlers/interactions.handler";
import { Templates } from "../handlers/templates";
import client from "../core/client/wts.client";
import { createExcell } from "../core/actions/hour/createExcell";
import { enviaEmail } from "../core/Events/app";

class Welcome {
  private async prepare(message: WAWebJS.Message) {
    const user = await connection<Tables.User>("tb_users")
      .select("*")
      .where({ wtsId: message.from })
      .first();
    const interaction = await Interactions?.get(user!.idUser);
    return {
      option: parseInt(message?.body, 10),
      user,
      interaction,
    };
  }

  async welcome(message: WAWebJS.Message) {
    const { option, interaction, user } = await this.prepare(message);
    switch (option) {
      case 1:
        await Interactions.remove(interaction!.idUser);
        await Interactions.create(user!.idUser, "hour", "welcome");
        const menuHora = await connection<Tables.Menu>("tb_menu")
          .select("*")
          .where({ parentCode: 4 });
        await message.reply(Templates.menu(menuHora));
        break;

      case 0:
        await Interactions.remove(interaction!.idUser);
        break;
    }
  }

  async hour(message: WAWebJS.Message) {
    const { option, interaction, user } = await this.prepare(message);

    switch (option) {
      case 1: // incluir horas
        await Interactions.remove(interaction!.idUser);
        await Interactions.create(user!.idUser, "createHour", "hour");
        await message.reply(Templates.dialogs.hourMaking.cadDate);
        break;
      case 2: // excluir horas
        const hoursId = await connection<Tables.Hour>("tb_hour")
          .select("*")
          .where({ idUser: user!.idUser });
        console.log(hoursId);

        if (hoursId.length > 0) {
          await Interactions.remove(interaction!.idUser);
          await Interactions.create(user!.idUser, "excludeHour", "hour");
          await message.reply(Templates.hourResume(hoursId));
          await client.sendMessage(
            message.from,
            Templates.dialogs.excludeHour.isHours
          );
        } else {
          message.reply(message.from, Templates.dialogs.excludeHour.isntHours);
        }

        break;
      case 3: // criar excell pra mandar no chat
        const arquivo = await createExcell(message,true);
        const media = MessageMedia.fromFilePath(arquivo.path.toString());
        await message.reply(media);
        break;
      case 4: // criar excell e enviar no email pro HEAD
        const sheet = await createExcell(message,false);
        const mailHead = new enviaEmail();
        mailHead.enviaIsso(
          Templates.email.emailSending,
          user?.emailHead,
          Templates.email.about.head,
          sheet,
          Templates.email.body
        );
        
        break;
      case 5: // enviar email pro financeiro

      // valida se é HEAD
      if(user?.emailHead == 'true'){
        const hourFinan = await createExcell(message,true);
        const mailFin = new enviaEmail();
        mailFin.enviaIsso(
          Templates.email.emailSending,
          Templates.email.emailFinance,
          Templates.email.about.fin,
          hourFinan,
          Templates.email.body
        );
      }
      else{
        return message.reply(Templates.dialogs.emailInfo.emailNotHead) // voce não é head mano
      }

        break;
      case 0:
        await Interactions.remove(interaction!.idUser);
        break;
    }
  }
  async redoHour(message: WAWebJS.Message) {
    const { option, interaction, user } = await this.prepare(message);

    switch (option) {
      case 1:
        await Interactions.remove(interaction!.idUser);
        await Interactions.create(user!.idUser, "createHour", "hour");
        await message.reply(Templates.dialogs.hourMaking.cadDate);
        break;

      default:
        await Interactions.remove(interaction!.idUser);
        await Interactions.create(user!.idUser, "welcome", "welcome");
        await message.reply(Templates.messages.not_implemented);
        break;
    }
  }
}

export default Welcome;
