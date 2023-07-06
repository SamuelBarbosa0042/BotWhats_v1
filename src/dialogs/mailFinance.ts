// pagina responsavel por mandar o email pro financeiro depois do HEAD aprovar
import WAWebJS from "whatsapp-web.js";
import {Tables} from "../@types/tables";
import Interactions from '../handlers/interactions.handler';
import connection from '../core/database'
import { Templates } from "../handlers/templates";
import { generateExcell } from "../core/actions/hour/createExcell";
import { enviaEmail } from "../core/Events/app";
import client from "../core/client/wts.client";



class mailFinances {
    private async getUser(message: WAWebJS.Message) {
        const user = await connection<Tables.User>("tb_users")
          .select("*")
          .where({ wtsId: message.from })
          .first();
        return user;
      }
    public async sendFinance(message: WAWebJS.Message){
        const archive = parseInt(message.body)
        const user = await this.getUser(message);

        if(archive == 0){ // caso usuario digite 0 ele para de aprovar as horas
            const interaction = await Interactions.get(user!.idUser);
            await Interactions.remove(interaction!.idUser);
            await Interactions.create(user!.idUser, "welcome", "welcome");

            return message.reply(Templates.operation.canceled)
        }

        //gerar novamente o excell  
        const hourstofin : Tables.excellData[] = await connection<Tables.Hour>('tb_hour')
          .select('*')
          .join<Tables.User>('tb_users'
                            ,'tb_hour.idUser'
                            ,'='
                            ,'tb_users.idUser')
          .where({idArchive:archive})

         if(!hourstofin){
            return message.reply(Templates.operation.invalid)
         }
         const sheet = await generateExcell(hourstofin);

         //enviar o email pro financeiro
 
         const mailHead = new enviaEmail();
         mailHead.enviaIsso(
           Templates.email.emailSending,
           user?.emailHead,
           Templates.email.about.head,
           sheet,
           Templates.email.body
         );
 
        await client.sendMessage(message.from,Templates.email.emailSucess)
        
         // alterar chekcFinanceiro para true
             
        await connection<Tables.Hour>('tb_hour').update({
            checkFinance: true
          }).where('idArchive',archive)






        await message.reply(Templates.operation.wishContinue)
         //finalizar a operação perguntando se ele quer aprovar outro ou digitar 0 para parar

    }
}
