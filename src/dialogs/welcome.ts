import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js";
import connection from "../core/database";
import { Tables } from "../@types/tables";
import Interactions from "../handlers/interactions.handler";
import { Templates } from "../handlers/templates";
import client from "../core/client/wts.client";
import { createExcell, generateExcell } from "../core/actions/hour/createExcell";
import { enviaEmail } from "../core/Events/app";
import { ClientRequest } from "http";

type Tipo = "fin" | "head" 

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
  
  private async getHour(message: WAWebJS.Message,stage: Tipo){ // returna as horas
    if(stage == "fin"){
      const hour = await connection<Tables.Hour>("tb_hour")
                                                .select('idHour','tb_users.name',)
                                                .join<Tables.User>('tb_users','tb_users.userId','=','tb_hour.userId')
                                                .where('tb_users.wtsId','=',message.from)
                                                .andWhere({checkHead: false})
                                                .andWhere({checkFinance: false})

      return hour
    }
    else if(stage = "head"){
      const hour:Tables.excellData[] = await connection<Tables.Hour>("tb_hour")
                                                .select()
                                                .join<Tables.User>('tb_users','tb_users.userId','=','tb_hour.userId')
                                                .where('tb_users.wtsId','=',message.from)
                                                .andWhere({checkHead: true})
                                                .andWhere({checkFinance: false})

      return hour
    }
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
          const menuHora = await connection<Tables.Menu>("tb_menu")
          .select("*")
          .where({ parentCode: 4 });
        //await message.reply(Templates.menu(menuHora));
        
        const hoursToAprove: Tables.excellData[] = await connection<Tables.Hour>('tb_hour')
                                                        .join<Tables.User>('tb_users'
                                                                          ,'tb_hour.idUser'
                                                                          ,'='
                                                                          ,'tb_users.idUser')
                                                        .where({checkHead:false,checkFinance:false,wtsId:message.from})
        
        const arquivo = await generateExcell(hoursToAprove);
        const media = MessageMedia.fromFilePath(arquivo.path.toString());
        
        
        await message.reply(media);
        await client.sendMessage(message.from,Templates.menu(menuHora))
        await Interactions.remove(interaction!.idUser);
        await Interactions.create(user!.idUser, "hour", "welcome");
        break;





      case 4: // criar excell e enviar no email pro HEAD
      try{
        const hourstoHead : Tables.excellData[] = await connection<Tables.Hour>('tb_hour')
        .select('*')
        .join<Tables.User>('tb_users'
                          ,'tb_hour.idUser'
                          ,'='
                          ,'tb_users.idUser')
        .where({checkHead:false,checkFinance:false,wtsId:message.from})

        const idHours: number[] = hourstoHead.map( hora => hora.idHour)


        const randomInt = (min: number, max:number) => Math.floor(Math.random() * (max - min + 1)) + min;

        const random = randomInt(1,99999)


        await connection<Tables.Hour>('tb_hour').update({
          idArchive:random,
          checkHead:true
        }).whereIn('idHour',idHours)
        
        
          const sheet = await generateExcell(hourstoHead);
          const mailHead = new enviaEmail();
          mailHead.enviaIsso(
            Templates.email.emailSending,
            user?.emailHead,
            Templates.email.about.head,
            sheet,
            Templates.email.body
          );

          client.sendMessage(message.from,Templates.email.sucess)
        }
        catch(err){
          throw err
        }

        break;
      case 5: // Abrir menu Head

      // valida se é HEAD
      if(user?.emailHead == 'true'){
        await Interactions.remove(interaction!.idUser);
        await Interactions.create(user!.idUser, "headMenu", "welcome");
        const menuHead = await connection<Tables.Menu>("tb_menu")
                                        .select("*")
                                        .where({ parentCode: 10 }); // mudaro  parent code para quando
        await message.reply(Templates.menu(menuHead));
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
  async headMenu(message: WAWebJS.Message){
    const { option, interaction, user } = await this.prepare(message);

    switch(option){
      case 1: //ver horas a serem aprovadas por você e aprovar

        const idArchives: Tables.Hour[] = await connection<Tables.Hour>('tb_hour').select('idArchives').whereNotNull('idArchive').andWhere({checkHead:true}).groupBy('idArchives')
        
        for await(const idArchive of idArchives){
          const hourstofin : Tables.excellData[] = await connection<Tables.Hour>('tb_hour')
          .select('*')
          .join<Tables.User>('tb_users'
                            ,'tb_hour.idUser'
                            ,'='
                            ,'tb_users.idUser')
          .where({idArchive:idArchive.idArchive})
          const sheet = await generateExcell(hourstofin);

          const media = MessageMedia.fromFilePath(sheet.path.toString());
        


          await client.sendMessage(message.from,Templates.dialogs.sendMessage(idArchive))
          await client.sendMessage(message.from,media)

        }
        //mandar template solicitando qual deseja aprovar

        await Interactions.remove(interaction!.idUser);
        await Interactions.create(user!.idUser, "sendFinance", "mailFinancce");
        //encmaminhar para pagina que faz a tratativa da aprovação

        break;
      case 2: //ver horas pendentes de aprovação do financeiro
        //const hoursToAprove = this.getHour(message,'fin')
        break;
      case 3: //retirar horas da aprovação do financeiro
        const removeHours = this.getHour(message,'fin')
        break;
      default:
        break;
    }
  }
}


export default Welcome;
