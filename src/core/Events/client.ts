import { MessageMedia } from "whatsapp-web.js";
import client from "../client/wts.client";
import qrcode from "qrcode-terminal";
import { messageHandler } from "../../handlers/message.handler";
// const { sendQrCode } = require('../../common/utils/qrToDisc.util');

client.on("qr", (qr: string) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  //const media = await MessageMedia.fromUrl('https://images.squarespace-cdn.com/content/v1/5e7d0e87853917613964998c/1586365377311-5U14I8VN4HY3NVLWV2FM/f2e1ab082e83ac27c667ae2d6102a3fe.jpg')
  client.sendMessage("5511991843099@c.us", "it's alive!!");
});

client.on("message", messageHandler);
